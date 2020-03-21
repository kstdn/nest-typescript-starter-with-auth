import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function EqualsTo<T>(
  property: keyof T,
  validationOptions?: ValidationOptions,
) {
  return function(object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      name: 'equalsTo',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: {
        message: `Property '${propertyName}' does not match '${property}'`,
        ...validationOptions,
      },
      validator: {
        validate(
          value: any,
          args: ValidationArguments,
        ): boolean | Promise<boolean> {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
      },
    });
  };
}
