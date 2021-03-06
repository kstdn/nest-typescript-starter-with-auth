import { ValidationError } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export const validationExceptionFactory = (
  errors: ValidationError[],
): BadRequestException => {
  return new BadRequestException(
    errors.reduce((acc, error) => {
      return acc.concat(Object.values(error.constraints));
    }, []),
  );
};
