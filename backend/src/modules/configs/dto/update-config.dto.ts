import { IsNumber, IsOptional, IsBoolean, IsString, Matches, Min } from 'class-validator';

export class UpdateConfigDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  peoplePerAC?: number;

  @IsOptional()
  @IsNumber()
  minTemp?: number;

  @IsOptional()
  @IsNumber()
  maxTemp?: number;

  @IsOptional()
  @IsNumber()
  defaultTemp?: number;

  @IsOptional()
  @IsBoolean()
  autoMode?: boolean;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  startTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  endTime?: string;
}
