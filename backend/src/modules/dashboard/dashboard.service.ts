import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ACStatus, Role } from '../../common/enums';
import { PrismaService } from '../../prisma/prisma.service';

interface AuthUser {
  id: string;
  role: Role;
}

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

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

  async getStats(user: AuthUser) {
    const roomWhere = user.role === Role.ADMIN ? {} : { userId: user.id };

    const rooms = await this.prisma.room.findMany({
      where: roomWhere,
      select: {
        id: true,
      },
    });

    const roomIds = rooms.map((room: { id: string }) => room.id);

    const [totalRooms, totalAcs, acOnCount, latestAlerts] = await this.prisma.$transaction([
      this.prisma.room.count({ where: roomWhere }),
      this.prisma.airConditioner.count({ where: { roomId: { in: roomIds } } }),
      this.prisma.airConditioner.count({
        where: {
          roomId: { in: roomIds },
          status: ACStatus.ON,
        },
      }),
      this.prisma.activityLog.findMany({
        where: {
          roomId: { in: roomIds },
          action: {
            in: ['SENSOR_AUTO_CONTROL'],
          },
        },
        orderBy: { timestamp: 'desc' },
        take: 10,
      }),
    ]);

    return {
      totalRooms,
      totalAcs,
      acOnCount,
      alerts: latestAlerts,
    };
  }

  async getRoomChart(roomId: string, user: AuthUser) {
    await this.assertRoomAccess(roomId, user);

    const logs = await this.prisma.sensorLog.findMany({
      where: { roomId },
      orderBy: { timestamp: 'asc' },
      take: 200,
    });

    return logs.map((log: { timestamp: Date; peopleCount: number; temperature: number }) => ({
      timestamp: log.timestamp,
      peopleCount: log.peopleCount,
      temperature: log.temperature,
    }));
  }

  async getRoomHistory(roomId: string, user: AuthUser) {
    await this.assertRoomAccess(roomId, user);

    return this.prisma.activityLog.findMany({
      where: { roomId },
      orderBy: { timestamp: 'desc' },
      take: 100,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  }
}
