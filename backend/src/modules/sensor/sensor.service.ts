import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ACStatus } from '../../common/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { AirConditionersService } from '../air-conditioners/air-conditioners.service';
import { SensorUpdateDto } from './dto/sensor-update.dto';

@Injectable()
export class SensorService {
  private readonly minIntervalMs = 3000;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly airConditionersService: AirConditionersService,
  ) {}

  validateDeviceKey(deviceKey: string | undefined): void {
    const expected = this.configService.get<string>('SENSOR_DEVICE_KEY', 'esp32-secret-key');

    if (!deviceKey || deviceKey !== expected) {
      throw new ForbiddenException('Invalid device key');
    }
  }

  private computeTargetWithHysteresis(
    peopleCount: number,
    peoplePerAC: number,
    currentOnCount: number,
    totalAcCount: number,
  ): number {
    const baselineTarget = Math.floor(peopleCount / peoplePerAC);
    const clampedBaseline = Math.max(0, Math.min(totalAcCount, baselineTarget));

    if (clampedBaseline === currentOnCount) {
      return currentOnCount;
    }

    const margin = Math.max(1, Math.round(peoplePerAC * 0.1));

    if (clampedBaseline > currentOnCount) {
      const upThreshold = (currentOnCount + 1) * peoplePerAC + margin;
      return peopleCount >= upThreshold ? currentOnCount + 1 : currentOnCount;
    }

    const downThreshold = currentOnCount * peoplePerAC - margin;
    return peopleCount < downThreshold ? currentOnCount - 1 : currentOnCount;
  }

  async updateFromSensor(dto: SensorUpdateDto) {
    const room = await this.prisma.room.findUnique({
      where: { id: dto.roomId },
      include: {
        configuration: true,
        airConditioners: {
          include: { brand: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const latestSensorLog = await this.prisma.sensorLog.findFirst({
      where: { roomId: dto.roomId },
      orderBy: { timestamp: 'desc' },
    });

    if (latestSensorLog) {
      const elapsed = Date.now() - latestSensorLog.timestamp.getTime();
      if (elapsed < this.minIntervalMs) {
        throw new HttpException('Sensor updates are too frequent', HttpStatus.TOO_MANY_REQUESTS);
      }
    }

    await this.prisma.$transaction([
      this.prisma.room.update({
        where: { id: dto.roomId },
        data: {
          currentPeople: dto.peopleCount,
          currentTemperature: dto.temperature,
        },
      }),
      this.prisma.sensorLog.create({
        data: {
          roomId: dto.roomId,
          peopleCount: dto.peopleCount,
          temperature: dto.temperature,
        },
      }),
    ]);

    const config = room.configuration ?? {
      peoplePerAC: 10,
      autoMode: true,
      defaultTemp: 25,
    };

    const currentOnCount = room.airConditioners.filter(
      (ac: { status: ACStatus }) => ac.status === ACStatus.ON,
    ).length;
    const totalAcCount = room.airConditioners.length;

    let targetOnCount = currentOnCount;

    if (config.autoMode && totalAcCount > 0) {
      targetOnCount = this.computeTargetWithHysteresis(
        dto.peopleCount,
        config.peoplePerAC,
        currentOnCount,
        totalAcCount,
      );

      await this.airConditionersService.syncRoomAutoState(dto.roomId, targetOnCount);

      await this.prisma.activityLog.create({
        data: {
          roomId: dto.roomId,
          action: 'SENSOR_AUTO_CONTROL',
          details: {
            peopleCount: dto.peopleCount,
            peoplePerAC: config.peoplePerAC,
            targetOnCount,
            totalAcCount,
          },
        },
      });
    }

    const latestAcs = await this.prisma.airConditioner.findMany({
      where: { roomId: dto.roomId },
      include: { brand: true },
      orderBy: { createdAt: 'asc' },
    });

    return {
      roomId: dto.roomId,
      peopleCount: dto.peopleCount,
      temperature: dto.temperature,
      autoMode: config.autoMode,
      acSummary: {
        total: totalAcCount,
        on: latestAcs.filter((ac: { status: ACStatus }) => ac.status === ACStatus.ON).length,
      },
      acCommands: latestAcs.map((ac: {
        id: string;
        name: string;
        mode: unknown;
        currentTemp: number;
        status: ACStatus;
        brand: { name: string; irProtocol: string };
      }) => ({
        acId: ac.id,
        name: ac.name,
        brand: ac.brand.name,
        protocol: ac.brand.irProtocol,
        shouldPowerOn: ac.status === ACStatus.ON,
        mode: ac.mode,
        temperature: ac.currentTemp,
      })),
    };
  }
}
