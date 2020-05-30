import { FindOperator } from 'typeorm';

/**
 * Find Options Operator.
 * Example: { someField: ILike("%some sting%") }
 */
export function ILike<T>(value: T | FindOperator<T>): FindOperator<T> {
  return new FindOperator('ilike', value);
}
