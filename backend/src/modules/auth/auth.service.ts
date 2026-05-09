import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const password = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password,
        fullName: dto.fullName,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      user,
      token: await this.signToken(user.id, user.email, user.role),
    };
  }

  async login(dto: LoginDto) {
    console.log('LOGIN DTO:', dto);

    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    console.log('FOUND USER:', user);

    if (!user) {
      console.log('USER NOT FOUND');
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    console.log('PASSWORD MATCH:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('PASSWORD WRONG');
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async profile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  private async signToken(
    id: string,
    email: string,
    role: string,
  ): Promise<string> {
    const expiresInRaw = this.configService.get<string>(
      'JWT_EXPIRES_IN',
      '86400',
    );
    const expiresIn = Number(expiresInRaw);

    return this.jwtService.signAsync(
      {
        sub: id,
        email,
        role,
      },
      {
        secret: this.configService.get<string>(
          'JWT_SECRET',
          'super-secret-jwt-key-change-me',
        ),
        expiresIn: Number.isNaN(expiresIn) ? 86400 : expiresIn,
      },
    );
  }
}
