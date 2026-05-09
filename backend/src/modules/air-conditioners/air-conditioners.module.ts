import { Module } from '@nestjs/common';
import { AirConditionersController } from './air-conditioners.controller';
import { AirConditionersService } from './air-conditioners.service';

@Module({
  controllers: [AirConditionersController],
  providers: [AirConditionersService],
  exports: [AirConditionersService],
})
export class AirConditionersModule {}
