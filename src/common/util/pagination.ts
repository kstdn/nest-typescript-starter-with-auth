export type PaginationOptions = {
  page: number;
  limit: number;
};

export type Paginated<T> = {
  items: T[];
  itemsCount: number;
  totalCount: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
};

export const getPaginated = <T>(
  items: T[],
  totalCount: number,
  currentPage: number,
  limit: number,
): Paginated<T> => {
  const totalPages = Math.ceil(totalCount / limit);

  return {
    items,
    itemsCount: items.length,
    totalCount: totalCount,
    itemsPerPage: limit,
    currentPage,
    totalPages,
  };
};
