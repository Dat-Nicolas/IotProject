import { IsUUID, IsNumber, Min, Max } from 'class-validator';

export class SensorUpdateDto {
  @IsUUID()
  roomId!: string;

  @IsNumber()
  @Min(0)
  peopleCount!: number;

  @IsNumber()
  @Min(-10)
  @Max(60)
  temperature!: number;
}
