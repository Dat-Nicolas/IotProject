import { ACMode, ACStatus } from '../../../common/enums';

export class UpdateAcDto {
  name?: string;
  status?: ACStatus;
  currentTemp?: number;
  mode?: ACMode;
}
