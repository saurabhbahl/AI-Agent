export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const parsePagination = (query: {
  page?: string;
  limit?: string;
  sort?: string;
  order?: string;
}) => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '12', 10)));
  const sort = query.sort || 'createdAt';
  const order = query.order === 'asc' ? 1 : -1;
  const skip = (page - 1) * limit;
  return { page, limit, sort, order, skip };
};

export const generateSku = (prefix: string, index: number): string =>
  `${prefix.toUpperCase()}-${String(index).padStart(4, '0')}`;
