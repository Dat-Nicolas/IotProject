import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '../../common/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

interface AuthUser {
  id: string;
  role: Role;
}

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRoomDto, user: AuthUser) {
    const ownerId = user.role === Role.ADMIN && dto.userId ? dto.userId : user.id;

    const room = await this.prisma.room.create({
      data: {
        name: dto.name,
        location: dto.location,
        userId: ownerId,
      },
      include: {
        airConditioners: true,
        configuration: true,
      },
    });

    await this.prisma.configuration.create({
      data: {
        roomId: room.id,
      },
    });

    return this.findOne(room.id, user);
  }

  async findAll(user: AuthUser) {
    const rooms = await this.prisma.room.findMany({
      where: user.role === Role.ADMIN ? {} : { userId: user.id },
      include: {
        airConditioners: true,
        configuration: true,
        sensorLogs: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return rooms.map(
      (room: { sensorLogs: unknown[] } & Record<string, unknown>) => ({
      ...room,
      latestSensorLog: room.sensorLogs[0] ?? null,
      sensorLogs: undefined,
      }),
    );
  }

  async findOne(id: string, user: AuthUser) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: {
        airConditioners: {
          include: { brand: true },
          orderBy: { createdAt: 'asc' },
        },
        configuration: true,
        sensorLogs: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (user.role !== Role.ADMIN && room.userId !== user.id) {
      throw new ForbiddenException('Access denied to this room');
    }

    return {
      ...room,
      latestSensorLog: room.sensorLogs[0] ?? null,
      sensorLogs: undefined,
    };
  }

  async update(id: string, dto: UpdateRoomDto, user: AuthUser) {
    await this.findOne(id, user);

    await this.prisma.room.update({
      where: { id },
      data: dto,
    });

    return this.findOne(id, user);
  }

  async remove(id: string, user: AuthUser) {
    await this.findOne(id, user);
    await this.prisma.room.delete({ where: { id } });
    return { id };
  }
}
