import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
// Quan trọng: Phải import từ đúng thư mục generated bạn đã cấu hình trong schema
import { PrismaClient } from '../generated/prisma-client'; 

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Database connected successfully');
    } catch (error) {
      this.logger.error('❌ Database connection failed', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    // Không chạy xóa data trên môi trường production
    if (process.env.NODE_ENV === 'production') return;
    
    // Danh sách các bảng theo Schema của bạn
    const tableNames = [
      'ActivityLog', 'SensorLog', 'Schedule', 'Configuration', 
      'AirConditioner', 'Brand', 'Room', 'User'
    ];
    
    for (const table of tableNames) {
      try {
        await this.$executeRawUnsafe(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`);
      } catch (e) {
        this.logger.warn(`Could not truncate table ${table}: ${e.message}`);
      }
    }
  }
}