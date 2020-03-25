import { Controller, Get } from '@nestjs/common';
import { Routes } from '../../../routes';
import { Resource } from '../resources/resource';
import { ReadAny } from '../resources/operations';
import { Authorize } from '../decorators/authorize.decorator';
import { Resource as ResourceEntity } from '../entities/resource.entity';

@Controller(`${Routes.Authorization.Root}/${Routes.Authorization.Resources}`)
export class ResourcesController {
  @Authorize(ReadAny(Resource.Resource))
  @Get()
  getAll(): Promise<ResourceEntity[]> {
    return ResourceEntity.find();
  }
}
