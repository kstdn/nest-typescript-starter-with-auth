import { Injectable, NotFoundException } from '@nestjs/common';
import { FilteringOptions } from 'src/common/util/filtering';
import { OrderingOptions } from 'src/common/util/ordering';
import { Paginated, PaginationOptions } from 'src/common/util/pagination';
import { Exception } from '../../../common/exceptions/exception.enum';
import { whereIsActive } from '../../../common/util/find-options.util';
import { Resource } from '../entities/resource.entity';

@Injectable()
export class ResourcesService {
  async findAllPaginated(
    paginationOptions: PaginationOptions,
    filteringOptions: FilteringOptions,
    orderingOptions: OrderingOptions,
  ): Promise<Paginated<Resource>> {
    return Resource.findAllPaginated<Resource>(
      filteringOptions,
      paginationOptions,
      orderingOptions,
    );
  }

  async findOneOrThrow(resourceId: string): Promise<Resource> {
    return Resource.findOneOrFail(resourceId, whereIsActive).catch(() => {
      throw new NotFoundException(Exception.RESOURCE_NOT_FOUND);
    });
  }
}
