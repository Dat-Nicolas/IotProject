import { ACMode, ACStatus } from '../../../common/enums';
import { IsEnum, IsOptional, IsNumber, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateAcDto {
  @IsString()
  name!: string;

  @IsUUID()
  roomId!: string;

  @IsUUID()
  brandId!: string;

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
