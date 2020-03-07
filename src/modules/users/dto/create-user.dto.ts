import { IsEmail, IsNotEmpty, ValidateIf } from 'class-validator';
import { EmailDoesNotExist } from '../../../validators/email-does-not-exist';
import { EqualsTo } from '../../../validators/equals-to';
import { UsernameDoesNotExist } from '../../../validators/username-does-not-exist';

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
