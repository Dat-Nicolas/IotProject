import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

interface AuthUser {
  id: string;
  role: Role;
}

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  stats(@CurrentUser() user: AuthUser) {
    return this.dashboardService.getStats(user);
  }

  @Get('room/:id/chart')
  roomChart(@Param('id') roomId: string, @CurrentUser() user: AuthUser) {
    return this.dashboardService.getRoomChart(roomId, user);
  }

  @Get('room/:id/history')
  roomHistory(@Param('id') roomId: string, @CurrentUser() user: AuthUser) {
    return this.dashboardService.getRoomHistory(roomId, user);
  }
}
