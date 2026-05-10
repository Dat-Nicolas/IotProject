import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { LogsQueryDto } from './dto/logs-query.dto';
import { LogsService } from './logs.service';

interface AuthUser {
  id: string;
  role: Role;
}

@UseGuards(JwtAuthGuard)
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get('sensor/:roomId')
  getSensorLogs(
    @Param('roomId') roomId: string,
    @CurrentUser() user: AuthUser,
    @Query() query: LogsQueryDto,
  ) {
    return this.logsService.getSensorLogs(roomId, user, query);
  }

  @Get('activity/:roomId')
  getActivityLogs(
    @Param('roomId') roomId: string,
    @CurrentUser() user: AuthUser,
    @Query() query: LogsQueryDto,
  ) {
    return this.logsService.getActivityLogs(roomId, user, query);
  }
}
