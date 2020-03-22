import { IsNotEmpty } from 'class-validator';
import { EqualsTo } from '../../../common/validators/equals-to';

export class ChangePasswordDto {
  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  newPassword: string;

  @EqualsTo<ChangePasswordDto>('newPassword')
  newPasswordConfirm: string;
}
