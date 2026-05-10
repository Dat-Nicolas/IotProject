import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '../../common/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { LogsQueryDto } from './dto/logs-query.dto';

interface AuthUser {
  id: string;
  role: Role;
}

@Injectable()
export class LogsService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertRoomAccess(roomId: string, user: AuthUser) {
    const room = await this.prisma.room.findUnique({ where: { id: roomId } });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (user.role !== Role.ADMIN && room.userId !== user.id) {
      throw new ForbiddenException('Access denied to this room');
    }
  }

  async getSensorLogs(roomId: string, user: AuthUser, query: LogsQueryDto) {
    await this.assertRoomAccess(roomId, user);

    const where = {
      roomId,
      timestamp: {
        gte: query.from ? new Date(query.from) : undefined,
        lte: query.to ? new Date(query.to) : undefined,
      },
    };

    const [total, items] = await this.prisma.$transaction([
      this.prisma.sensorLog.count({ where }),
      this.prisma.sensorLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
    ]);

    return {
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
      },
      items,
    };
  }

  async getActivityLogs(roomId: string, user: AuthUser, query: LogsQueryDto) {
    await this.assertRoomAccess(roomId, user);

    const where = {
      roomId,
      action: query.action,
      timestamp: {
        gte: query.from ? new Date(query.from) : undefined,
        lte: query.to ? new Date(query.to) : undefined,
      },
    };

    const [total, items] = await this.prisma.$transaction([
      this.prisma.activityLog.count({ where }),
      this.prisma.activityLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
        },
        orderBy: { timestamp: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
    ]);

    return {
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
      },
      items,
    };
  }
}
