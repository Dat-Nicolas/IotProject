import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AirConditionersModule } from '../air-conditioners/air-conditioners.module';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';

@Module({
  imports: [ConfigModule, AirConditionersModule],
  controllers: [SensorController],
  providers: [SensorService],
})
export class SensorModule {}
