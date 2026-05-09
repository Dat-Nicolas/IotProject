import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ACStatus, Role } from '../../common/enums';
import { Prisma } from '../../../src/generated/prisma-client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAcDto } from './dto/create-ac.dto';
import { UpdateAcDto } from './dto/update-ac.dto';
import { ControlAcDto } from './dto/control-ac.dto';

interface AuthUser {
  id: string;
  role: Role;
}

@Injectable()
export class AirConditionersService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateRoomAccess(roomId: string, user: AuthUser) {
    if (!roomId) {
      throw new NotFoundException('Room id is required');
    }

    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (user.role !== Role.ADMIN && room.userId !== user.id) {
      throw new ForbiddenException('Access denied to this room');
    }

    return room;
  }

  async create(dto: CreateAcDto, user: AuthUser) {
    await this.validateRoomAccess(dto.roomId, user);

    const ac = await this.prisma.airConditioner.create({
      data: {
        name: dto.name,
        roomId: dto.roomId,
        brandId: dto.brandId,
        status: dto.status,
        currentTemp: dto.currentTemp,
        mode: dto.mode,
      },
      include: {
        brand: true,
        room: true,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        roomId: dto.roomId,
        userId: user.id,
        action: 'AC_CREATED',
        details: {
          acId: ac.id,
          name: ac.name,
        },
      },
    });

    return ac;
  }

  /**
   * Hỗ trợ:
   * GET /api/air-conditioners
   * GET /api/air-conditioners?roomId=xxx
   */
  async findAll(roomId: string | undefined, user: AuthUser) {
    // Nếu có roomId thì validate quyền truy cập phòng
    if (roomId) {
      await this.validateRoomAccess(roomId, user);
    }

    return this.prisma.airConditioner.findMany({
      where: {
        // nếu có roomId thì filter theo room
        ...(roomId ? { roomId } : {}),

        // nếu không phải admin thì chỉ lấy AC thuộc room của chính user đó
        ...(user.role !== Role.ADMIN
          ? {
              room: {
                userId: user.id,
              },
            }
          : {}),
      },

      include: {
        brand: true,
        room: true,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findOne(id: string, user: AuthUser) {
    const ac = await this.prisma.airConditioner.findUnique({
      where: { id },
      include: {
        room: true,
        brand: true,
      },
    });

    if (!ac) {
      throw new NotFoundException('Air conditioner not found');
    }

    await this.validateRoomAccess(ac.roomId, user);

    return ac;
  }

  async update(id: string, dto: UpdateAcDto, user: AuthUser) {
    const ac = await this.findOne(id, user);

    const updated = await this.prisma.airConditioner.update({
      where: { id },
      data: dto,
      include: {
        brand: true,
        room: true,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        roomId: ac.roomId,
        userId: user.id,
        action: 'AC_UPDATED',
        details: ({
          acId: ac.id,
          changes: dto,
        } as unknown) as Prisma.InputJsonValue,
      },
    });

    return updated;
  }

  async control(id: string, dto: ControlAcDto, user: AuthUser) {
    const ac = await this.findOne(id, user);

    const controlled = await this.prisma.airConditioner.update({
      where: { id },
      data: {
        status: dto.status,
        currentTemp: dto.currentTemp,
        mode: dto.mode,
      },
      include: {
        room: true,
        brand: true,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        roomId: ac.roomId,
        userId: user.id,
        action: 'AC_CONTROLLED',
        details: {
          acId: ac.id,
          status: dto.status ?? ac.status,
          currentTemp: dto.currentTemp ?? ac.currentTemp,
          mode: dto.mode ?? ac.mode,
        },
      },
    });

    return {
      ...controlled,
      irCommand: {
        protocol: controlled.brand.irProtocol,
        payload: {
          status: controlled.status,
          mode: controlled.mode,
          temperature: controlled.currentTemp,
        },
      },
    };
  }

  async remove(id: string, user: AuthUser) {
    const ac = await this.findOne(id, user);

    await this.prisma.airConditioner.delete({
      where: { id },
    });

    await this.prisma.activityLog.create({
      data: {
        roomId: ac.roomId,
        userId: user.id,
        action: 'AC_REMOVED',
        details: {
          acId: ac.id,
          name: ac.name,
        },
      },
    });

    return { id };
  }

  async syncRoomAutoState(roomId: string, acToTurnOn: number) {
    const roomAcs = await this.prisma.airConditioner.findMany({
      where: { roomId },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const total = roomAcs.length;
    const targetOn = Math.max(0, Math.min(acToTurnOn, total));

    const actions = roomAcs.map(
      (ac: { id: string }, index: number) => {
        const shouldBeOn = index < targetOn;

        return this.prisma.airConditioner.update({
          where: {
            id: ac.id,
          },
          data: {
            status: shouldBeOn ? ACStatus.ON : ACStatus.OFF,
          },
        });
      },
    );

    await this.prisma.$transaction(actions);

    return {
      total,
      targetOn,
      targetOff: total - targetOn,
    };
  }
}