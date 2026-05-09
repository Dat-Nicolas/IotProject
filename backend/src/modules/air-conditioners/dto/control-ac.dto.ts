import { ACMode, ACStatus } from '../../../common/enums';
import { IsEnum, IsOptional, IsNumber, Max, Min } from 'class-validator';

export class ControlAcDto {
  @IsOptional()
  @IsEnum(ACStatus)
  status?: ACStatus;

  @IsOptional()
  @IsNumber()
  @Min(16)
  @Max(32)
  currentTemp?: number;

  @IsOptional()
  @IsEnum(ACMode)
  mode?: ACMode;
}
