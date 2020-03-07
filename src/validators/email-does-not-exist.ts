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
export class EmailDoesNotExistConstraint
  implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  async validate(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    return !user;
  }
}

export function EmailDoesNotExist(validationOptions?: ValidationOptions) {
  return function(object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `User with email $value already exists.`,
        ...validationOptions,
      },
      constraints: [],
      validator: EmailDoesNotExistConstraint,
    });
  };
}
