import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseBoolInObjectPipe implements PipeTransform<any> {
  transform(object: any): any {
    for (const key in object) {
      const value = object[key];
      if (value === true || value === 'true') {
        object[key] = true;
      }
      if (value === false || value === 'false') {
        object[key] = false;
      }
    }

    return object;
  }
}
