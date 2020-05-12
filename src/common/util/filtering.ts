import {
  Equal,
  FindConditions,
  FindOperator,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  ObjectLiteral,
} from 'typeorm';

type Where =
  | FindConditions<any>[]
  | FindConditions<any>
  | ObjectLiteral
  | string;

export type FilteringOptions = FilteringOption[];
export type OperatorType = 'eq' | 'not' | 'like' | 'gt' | 'gte' | 'lt' | 'lte';

export type AndCondition = 'and';
export type OrCondition = 'or';
export type Condition = AndCondition | OrCondition;

export const ANDConditionValue: AndCondition = 'and';
export const ORConditionValue: OrCondition = 'or';

export type FilteringOption = {
  condition?: Condition;
  property: string;
  operator: OperatorType;
  value: string;
};

const getClause = (option: FilteringOption): FindOperator<string> => {
  switch (option.operator) {
    case 'eq':
      return Equal(option.value);
    case 'not':
      return Not(option.value);
    case 'lt':
      return LessThan(option.value);
    case 'lte':
      return LessThanOrEqual(option.value);
    case 'gt':
      return MoreThan(option.value);
    case 'gte':
      return MoreThanOrEqual(option.value);
    case 'like':
      return Like(`%${option.value}%`);
    default:
      break;
  }
};

export const getWhereCondition = (filteringOption: FilteringOption): Where => {
  const pathSegments = filteringOption.property.split('.');

  const wrapSegment = (pathSegments: string[]): Where => {
    const pathSegment = pathSegments.shift();
    if (pathSegments.length > 0) {
      return { [pathSegment]: wrapSegment(pathSegments) };
    } else {
      return { [pathSegment]: getClause(filteringOption) };
    }
  };

  return wrapSegment(pathSegments);
};

export const getFilters = (filteringOptions: FilteringOptions): Where => {
  const result: Where = [];

  for (const filteringOption of filteringOptions) {
    const whereCondition = getWhereCondition(filteringOption);
    if (filteringOption.condition === 'and') {
      const lastCondition = result[result.length - 1] || {};
      Object.assign(lastCondition, whereCondition);
    } else {
      result.push(whereCondition);
    }
  }

  return result;
};
