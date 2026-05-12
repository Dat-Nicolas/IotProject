import { Module } from '@nestjs/common';
import { CameraController } from './camera.controller';
import { CameraService } from './camera.service';
import { HuggingFaceService } from './huggingface.service';

@Module({
  controllers: [CameraController],
  providers: [CameraService, HuggingFaceService],
})
export class CameraModule {}