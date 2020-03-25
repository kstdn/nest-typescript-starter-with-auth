import { Injectable, NotFoundException } from '@nestjs/common';
import { Exception } from '../../../common/exceptions/exception.enum';
import { whereIsActive } from '../../../common/util/find-options.util';
import { Resource } from '../entities/resource.entity';

@Injectable()
export class ResourcesService {
  async findOneOrThrow(resourceId: string): Promise<Resource> {
    return Resource.findOneOrFail(resourceId, whereIsActive).catch(() => {
      throw new NotFoundException(Exception.RESOURCE_NOT_FOUND);
    });
  }
}
