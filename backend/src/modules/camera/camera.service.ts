import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { HuggingFaceService } from './huggingface.service';

@Injectable()
export class CameraService {
  private readonly logger = new Logger(CameraService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly hfService: HuggingFaceService,
  ) {}

  async testWithImageUrl(roomId: string, imageUrl: string) {
    try {
      const room = await this.prisma.room.findUnique({ where: { id: roomId } });

      if (!room) {
        throw new NotFoundException(`Room ${roomId} không tồn tại`);
      }

      this.logger.log(`🧪 Test URL: ${imageUrl}`);

      const hf = await this.hfService.detectPeopleFromUrl(imageUrl);

      const log = await this.prisma.cameraLog.create({
        data: {
          roomId,
          imageUrl,
          peopleCount: hf.peopleCount,
          confidence: hf.confidence,
          rawResult: hf.rawResult as any,
          processingMs: hf.processingMs,
          status: 'success',
        },
      });

      return {
        success: true,
        cameraLogId: log.id,
        roomId,
        peopleCount: hf.peopleCount,
        confidence: hf.confidence,
        processingMs: hf.processingMs,
        timestamp: log.timestamp,
        allDetectedObjects: hf.rawResult,
      };
    } catch (error) {
      this.logger.error(`💥 Error in testWithImageUrl: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getCameraLogs(roomId: string, limit = 20) {
    const logs = await this.prisma.cameraLog.findMany({
      where: { roomId },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    const stats = await this.prisma.cameraLog.aggregate({
      where: { roomId },
      _avg: { peopleCount: true, confidence: true },
      _count: true,
    });

    return {
      logs,
      stats: {
        total: stats._count,
        avgPeople: stats._avg.peopleCount ?? 0,
        avgConfidence: stats._avg.confidence ?? 0,
      },
    };
  }
}