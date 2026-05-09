import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AirConditionersService } from './air-conditioners.service';
import { ControlAcDto } from './dto/control-ac.dto';
import { CreateAcDto } from './dto/create-ac.dto';
import { UpdateAcDto } from './dto/update-ac.dto';

interface AuthUser {
  id: string;
  role: Role;
}

@UseGuards(JwtAuthGuard)
@Controller('air-conditioners')
export class AirConditionersController {
  constructor(private readonly airConditionersService: AirConditionersService) {}

  @Post()
  create(@Body() dto: CreateAcDto, @CurrentUser() user: AuthUser) {
    return this.airConditionersService.create(dto, user);
  }

  @Get()
  findAll(@Query('roomId') roomId: string, @CurrentUser() user: AuthUser) {
    return this.airConditionersService.findAll(roomId, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.airConditionersService.findOne(id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAcDto, @CurrentUser() user: AuthUser) {
    return this.airConditionersService.update(id, dto, user);
  }

  @Post(':id/control')
  control(@Param('id') id: string, @Body() dto: ControlAcDto, @CurrentUser() user: AuthUser) {
    return this.airConditionersService.control(id, dto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.airConditionersService.remove(id, user);
  }
}
