export const filterData = (filters: { [key: string]: string | undefined }): { query: string, params: any[] } => {
  let filterConditions: string[] = [];
  let queryParams: any[] = [];

  Object.keys(filters).forEach((key) => {
    if (key.startsWith('filter[')) {
      const fieldName = key.replace('filter[', '').replace(']', '');
      const value = filters[key];
      if (value === '' || fieldName === 'password' || fieldName === 'last_login') return;

      queryParams.push(value);
      filterConditions.push(`${fieldName} = $${queryParams.length}`); // PostgreSQL-style placeholder
    }
  });

  const query = filterConditions.length > 0 ? `WHERE ${filterConditions.join(' AND ')}` : '';
  return { query, params: queryParams };
};

export const searchData = (searchTerm: string | undefined, startingIndex: number): { query: string, params: any[] } => {
  let searchConditions: string[] = [];
  let queryParams: any[] = [];

  if (searchTerm) {
    const searchValue = searchTerm.toLowerCase();
    const searchFields = ['first_name', 'last_name', 'email', 'phone_number'];

    searchFields.forEach((field, index) => {
      queryParams.push(`%${searchValue}%`);
      searchConditions.push(`${field} ILIKE $${startingIndex + index}`); // ILIKE for case-insensitive
    });
  }

  const query = searchConditions.length > 0 ? `(${searchConditions.join(' OR ')})` : '';
  return { query, params: queryParams };
};

export const sortData = (filters: { [key: string]: string | undefined }): { query: string, params: any[] } => {
  const sortField = Object.keys(filters).find(key => key.startsWith('sort['))?.replace('sort[', '').replace(']', '');

  let sortOrder: 'ASC' | 'DESC' | undefined;
  if (sortField) {
    const order = filters[`sort[${sortField}]`];
    if (order === 'desc') {
      sortOrder = 'DESC';
    } else if (order === 'asc') {
      sortOrder = 'ASC';
    }
  }

  const query = sortField && sortOrder ? `ORDER BY ${sortField} ${sortOrder}` : '';
  return { query, params: [] };
};
