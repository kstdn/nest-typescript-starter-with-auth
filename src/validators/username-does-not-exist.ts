import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from '../modules/users/users.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class UsernameDoesNotExistConstraint
  implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  async validate(username: any): Promise<boolean> {
    const user = await this.usersService.findOneByUsername(username);
    return !user;
  }
}

export function UsernameDoesNotExist(validationOptions?: ValidationOptions) {
  return function(object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `User with username $value already exists.`,
        ...validationOptions,
      },
      constraints: [],
      validator: UsernameDoesNotExistConstraint,
    });
  };
}
