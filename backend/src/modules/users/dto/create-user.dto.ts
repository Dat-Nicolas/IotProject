import { Role } from '../../../common/enums';

export class CreateUserDto {
  fullName!: string;
  email!: string;
  password!: string;
  role?: Role;
}
