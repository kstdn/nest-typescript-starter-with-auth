import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Exception } from '../exceptions/exception.enum';
import {
  ANDConditionValue,
  Condition,
  FilteringOptions,
  OperatorType,
  ORConditionValue,
} from '../util/filtering';

const filterRegExp = new RegExp(
  /^([a-zA-Z.]+,(eq|not|like|gt|gte|lt|lte),[a-zA-Z0-9-]+(:(and|or):)?)*$/,
);

const extractFilteringOptions = (
  rawFilterQueryElements: string[],
  acceptedProperties: string[],
): FilteringOptions => {
  const filteringOptions: FilteringOptions = [];

  let lastCondition: Condition;
  for (const rawFilterQueryElement of rawFilterQueryElements) {
    if (
      rawFilterQueryElement === ANDConditionValue ||
      rawFilterQueryElement === ORConditionValue
    ) {
      lastCondition = rawFilterQueryElement;
    } else {
      const [property, operator, value] = rawFilterQueryElement.split(',');
      const condition = lastCondition;
      lastCondition = undefined;

      if (!acceptedProperties.includes(property)) {
        continue;
      }
      filteringOptions.push({
        condition,
        property,
        operator: operator as OperatorType,
        value,
      });
    }
  }

  return filteringOptions;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function FilterQuery(...acceptedProperties: string[]) {
  return createParamDecorator(
    (data: unknown, context: ExecutionContext): FilteringOptions => {
      const query = context.switchToHttp().getRequest().query;

      const rawFilterQuery: string | undefined | Array<any> = query?.filter;

      if (!rawFilterQuery) {
        return [];
      }

      if (rawFilterQuery instanceof Array) {
        throw new BadRequestException(Exception.ONLY_ONE_FILTER_ALLOWED);
      }

      if (!filterRegExp.test(rawFilterQuery)) {
        throw new BadRequestException(Exception.INVALID_FILTER);
      }

      const rawFilterQueryElements = rawFilterQuery
        ? rawFilterQuery.split(':')
        : [];

      return extractFilteringOptions(
        rawFilterQueryElements,
        acceptedProperties,
      );
    },
  )();
}
