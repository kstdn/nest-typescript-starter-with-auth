import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { classToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Response<T> {
  data: T;
}

/**
 * Applies 'class-transformer' transformations to paginated entities
 *
 * @export
 * @class ClassSerializerPaginatedInterceptor
 * @implements {NestInterceptor<T, Response<T>>}
 * @template T
 */
@Injectable()
export class ClassSerializerPaginatedInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next
      .handle()
      .pipe(
        map(paginated => ({
          ...paginated,
          items: classToClass(paginated.items),
        })),
      );
  }
}
