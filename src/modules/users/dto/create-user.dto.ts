import { IsEmail, IsNotEmpty, ValidateIf } from 'class-validator';
import { EmailDoesNotExist } from '../../../common/validators/email-does-not-exist';
import { EqualsTo } from '../../../common/validators/equals-to';
import { UsernameDoesNotExist } from '../../../common/validators/username-does-not-exist';

export class CreateUserDto {
  @IsNotEmpty()
  @UsernameDoesNotExist()
  username: string;

  @IsEmail()
  @EmailDoesNotExist()
  email: string;

  @EqualsTo<CreateUserDto>('email')
  emailConfirm: string;

  @IsNotEmpty()
  password: string;

  @EqualsTo<CreateUserDto>('password')
  @ValidateIf(o => !!o.password)
  passwordConfirm: string;

  firstName?: string;

  lastName?: string;
}
