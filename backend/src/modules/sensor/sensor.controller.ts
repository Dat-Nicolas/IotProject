import { Body, Controller, Headers, Post } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { SensorUpdateDto } from './dto/sensor-update.dto';

@Controller('sensor')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Post('update')
  update(@Headers('x-device-key') deviceKey: string | undefined, @Body() dto: SensorUpdateDto) {
    this.sensorService.validateDeviceKey(deviceKey);
    return this.sensorService.updateFromSensor(dto);
  }
}
