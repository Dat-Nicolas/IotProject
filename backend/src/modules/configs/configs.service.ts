import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '../../common/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';

interface AuthUser {
  id: string;
  role: Role;
}

@Injectable()
export class ConfigsService {
  constructor(private readonly prisma: PrismaService) {}

  private validateConfigBounds(dto: {
    minTemp?: number;
    maxTemp?: number;
    defaultTemp?: number;
    startTime?: string;
    endTime?: string;
  }): void {
    if (dto.minTemp !== undefined && dto.maxTemp !== undefined && dto.minTemp >= dto.maxTemp) {
      throw new BadRequestException('minTemp must be lower than maxTemp');
    }

    if (
      dto.defaultTemp !== undefined &&
      dto.minTemp !== undefined &&
      dto.defaultTemp < dto.minTemp
    ) {
      throw new BadRequestException('defaultTemp must be >= minTemp');
    }

    if (
      dto.defaultTemp !== undefined &&
      dto.maxTemp !== undefined &&
      dto.defaultTemp > dto.maxTemp
    ) {
      throw new BadRequestException('defaultTemp must be <= maxTemp');
    }

    if (dto.startTime && dto.endTime && dto.startTime >= dto.endTime) {
      throw new BadRequestException('startTime must be earlier than endTime');
    }
  }

  private async assertRoomAccess(roomId: string, user: AuthUser) {
    const room = await this.prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (user.role !== Role.ADMIN && room.userId !== user.id) {
      throw new ForbiddenException('Access denied to this room');
    }

    return room;
  }

  async create(dto: CreateConfigDto, user: AuthUser) {
    await this.assertRoomAccess(dto.roomId, user);
    this.validateConfigBounds(dto);

    const existing = await this.prisma.configuration.findUnique({
      where: { roomId: dto.roomId },
    });

    if (existing) {
      throw new BadRequestException('Configuration already exists for this room');
    }

    return this.prisma.configuration.create({
      data: dto,
    });
  }

  async findByRoomId(roomId: string, user: AuthUser) {
    await this.assertRoomAccess(roomId, user);

    const config = await this.prisma.configuration.findUnique({ where: { roomId } });
    if (!config) {
      throw new NotFoundException('Configuration not found');
    }

    return config;
  }

  async update(roomId: string, dto: UpdateConfigDto, user: AuthUser) {
    await this.assertRoomAccess(roomId, user);
    const current = await this.findByRoomId(roomId, user);

    this.validateConfigBounds({
      minTemp: dto.minTemp ?? current.minTemp,
      maxTemp: dto.maxTemp ?? current.maxTemp,
      defaultTemp: dto.defaultTemp ?? current.defaultTemp,
      startTime: dto.startTime ?? current.startTime,
      endTime: dto.endTime ?? current.endTime,
    });

    return this.prisma.configuration.update({
      where: { roomId },
      data: dto,
    });
  }

  async remove(roomId: string, user: AuthUser) {
    await this.findByRoomId(roomId, user);

    await this.prisma.configuration.delete({ where: { roomId } });
    return { roomId };
  }
}
