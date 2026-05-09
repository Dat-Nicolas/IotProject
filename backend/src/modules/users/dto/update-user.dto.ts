import { Role } from '../../../common/enums';

export class UpdateUserDto {
  fullName?: string;
  email?: string;
  password?: string;
  role?: Role;
}
