import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ConfigsService } from './configs.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';

interface AuthUser {
  id: string;
  role: Role;
}

@UseGuards(JwtAuthGuard)
@Controller('configs')
export class ConfigsController {
  constructor(private readonly configsService: ConfigsService) {}

  @Post()
  create(@Body() dto: CreateConfigDto, @CurrentUser() user: AuthUser) {
    return this.configsService.create(dto, user);
  }

  @Get(':roomId')
  findByRoomId(@Param('roomId') roomId: string, @CurrentUser() user: AuthUser) {
    return this.configsService.findByRoomId(roomId, user);
  }

  @Patch(':roomId')
  update(
    @Param('roomId') roomId: string,
    @Body() dto: UpdateConfigDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.configsService.update(roomId, dto, user);
  }

  @Delete(':roomId')
  remove(@Param('roomId') roomId: string, @CurrentUser() user: AuthUser) {
    return this.configsService.remove(roomId, user);
  }
}
