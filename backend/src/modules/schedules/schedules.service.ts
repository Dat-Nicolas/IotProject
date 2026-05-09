import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '../../common/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

interface AuthUser {
  id: string;
  role: Role;
}

@Injectable()
export class SchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  private validateTime(startTime?: string, endTime?: string): void {
    if (startTime && endTime && startTime >= endTime) {
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
  async findAll(roomId: string | undefined, user: AuthUser) {
    if (roomId) {
      await this.assertRoomAccess(roomId, user);
    }

    return this.prisma.schedule.findMany({
      where: {
        ...(roomId ? { roomId } : {}),

        ...(user.role !== Role.ADMIN
          ? {
              room: {
                userId: user.id,
              },
            }
          : {}),
      },

      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async create(dto: CreateScheduleDto, user: AuthUser) {
    await this.assertRoomAccess(dto.roomId, user);
    this.validateTime(dto.startTime, dto.endTime);

    return this.prisma.schedule.create({
      data: {
        roomId: dto.roomId,
        dayOfWeek: dto.dayOfWeek,
        startTime: dto.startTime,
        endTime: dto.endTime,
        isActive: dto.isActive,
      },
    });
  }
  async findOne(id: string, user: AuthUser) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: {
        room: true,
      },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    await this.assertRoomAccess(schedule.roomId, user);

    return schedule;
  }
  async findByRoom(roomId: string, user: AuthUser) {
    await this.assertRoomAccess(roomId, user);

    return this.prisma.schedule.findMany({
      where: { roomId },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  async update(id: string, dto: UpdateScheduleDto, user: AuthUser) {
    const schedule = await this.prisma.schedule.findUnique({ where: { id } });
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    await this.assertRoomAccess(schedule.roomId, user);
    this.validateTime(dto.startTime ?? schedule.startTime, dto.endTime ?? schedule.endTime);

    return this.prisma.schedule.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, user: AuthUser) {
    const schedule = await this.prisma.schedule.findUnique({ where: { id } });
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    await this.assertRoomAccess(schedule.roomId, user);
    await this.prisma.schedule.delete({ where: { id } });

    return { id };
  }
}
