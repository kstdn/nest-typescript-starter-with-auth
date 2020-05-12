import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PaginationOptions } from '../util/pagination';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function PaginationQuery(defaultPage = 1, defaultLimit = 10) {
  return createParamDecorator(
    (data: unknown, context: ExecutionContext): PaginationOptions => {
      const query = context.switchToHttp().getRequest().query;

      return {
        limit: query && query.limit && +(query.limit) || defaultLimit,
        page: query && query.page && +(query.page) || defaultPage,
      };
    },
  )();
}
