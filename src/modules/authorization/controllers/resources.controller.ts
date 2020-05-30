import { Controller, Get } from '@nestjs/common';
import { FilterQuery } from 'src/common/decorators/filter-query.decorator';
import { OrderQuery } from 'src/common/decorators/order-query.decorator';
import { PaginationQuery } from 'src/common/decorators/pagination-query.decorator';
import { FilteringOptions } from 'src/common/util/filtering';
import { OrderingOptions } from 'src/common/util/ordering';
import { Paginated, PaginationOptions } from 'src/common/util/pagination';
import { Routes } from '../../../routes';
import { Authorize } from '../decorators/authorize.decorator';
import { Resource as ResourceEntity } from '../entities/resource.entity';
import { ReadAny } from '../resources/operations';
import { Resource } from '../resources/resource';
import { ResourcesService } from '../services/resources.service';

@Controller(`${Routes.Authorization.Root}/${Routes.Authorization.Resources}`)
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Authorize(ReadAny(Resource.Resource))
  @Get()
  getAll(
    @PaginationQuery() paginationOptions: PaginationOptions,
    @FilterQuery('name') filteringOptions: FilteringOptions,
    @OrderQuery() orderingOptions: OrderingOptions,
  ): Promise<Paginated<ResourceEntity>> {
    return this.resourcesService.findAllPaginated(
      paginationOptions,
      filteringOptions,
      orderingOptions,
    );
  }
}
