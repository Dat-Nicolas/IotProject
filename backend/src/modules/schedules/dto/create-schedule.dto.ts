import { DayOfWeek } from '../../../common/enums';

export class CreateScheduleDto {
  roomId!: string;
  dayOfWeek!: DayOfWeek;
  startTime!: string;
  endTime!: string;
  isActive?: boolean;
}
