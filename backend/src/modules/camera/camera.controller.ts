import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  BadRequestException,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CameraService } from './camera.service';

@Controller('camera')
export class CameraController {
  constructor(private readonly cameraService: CameraService) {}

  @Post('test/:roomId')
  @HttpCode(HttpStatus.OK)
  async test(@Param('roomId') roomId: string, @Body() body: any) {
    if (!body?.imageUrl) {
      throw new BadRequestException('imageUrl is required');
    }

    try {
      return await this.cameraService.testWithImageUrl(roomId, body.imageUrl);
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.constructor.name,
      };
    }
  }

  @Get('logs/:roomId')
  async logs(
    @Param('roomId') roomId: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.cameraService.getCameraLogs(roomId, limit);
  }
}