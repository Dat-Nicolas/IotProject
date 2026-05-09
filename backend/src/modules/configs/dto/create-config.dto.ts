import { IsNumber, IsBoolean, IsString, IsUUID, Matches, Min } from 'class-validator';

export class CreateConfigDto {
  @IsUUID()
  roomId!: string;

  @IsNumber()
  @Min(1)
  peoplePerAC!: number;

  @IsNumber()
  minTemp!: number;

  @IsNumber()
  maxTemp!: number;

  @IsNumber()
  defaultTemp!: number;

  @IsBoolean()
  autoMode!: boolean;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  startTime!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  endTime!: string;
}
