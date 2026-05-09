import { DayOfWeek } from '../../../common/enums';

export class UpdateScheduleDto {
  dayOfWeek?: DayOfWeek;
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
}
