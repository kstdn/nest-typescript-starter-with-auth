import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { OrderingOptions } from '../util/ordering';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function OrderQuery(defaultDirection: 'ASC' | 'DESC' = 'ASC', defaultOrderBy?: string) {
  return createParamDecorator(
    (data: unknown, context: ExecutionContext): OrderingOptions => {
      const query = context.switchToHttp().getRequest().query;

      return {
        direction: query?.direction || defaultDirection,
        orderBy: query?.orderBy || defaultOrderBy,
      };
    },
  )();
}
