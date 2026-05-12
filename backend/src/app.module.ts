import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { AirConditionersModule } from './modules/air-conditioners/air-conditioners.module';
import { BrandsModule } from './modules/brands/brands.module';
import { SensorModule } from './modules/sensor/sensor.module';
import { ConfigsModule } from './modules/configs/configs.module';
import { LogsModule } from './modules/logs/logs.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { WeatherModule } from './modules/weather/weather.module';
import { CameraModule } from './modules/camera/camera.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RoomsModule,
    AirConditionersModule,
    BrandsModule,
    SensorModule,
    ConfigsModule,
    LogsModule,
    SchedulesModule,
    DashboardModule,
    WeatherModule,
    CameraModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
