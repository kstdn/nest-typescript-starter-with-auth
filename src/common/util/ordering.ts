import { OrderByCondition } from 'typeorm';

export type OrderingOptions = {
  orderBy: string;
  direction: 'ASC' | 'DESC';
};

export const getOrder = ({
  orderBy,
  direction,
}: OrderingOptions): OrderByCondition => {
  if (orderBy && direction) {
    return { [orderBy]: direction };
  }
};
