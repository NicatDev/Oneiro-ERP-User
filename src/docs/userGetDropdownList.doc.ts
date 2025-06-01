export const userDropdownListDoc = {
  get: {
    summary: 'Get dropdown list of active users',
    description: 'Returns a paginated list of active users with their full name and UUID, suitable for dropdowns.',
    tags: ['Users'],
    parameters: [
      {
        name: 'page',
        in: 'query',
        required: false,
        schema: { type: 'integer', minimum: 1 },
        description: 'Page number for pagination (default is 1)',
        example: 1
      },
      {
        name: 'pageSize',
        in: 'query',
        required: false,
        schema: { type: 'integer', minimum: 1 },
        description: 'Number of records per page (default is 10)',
        example: 10
      }
    ],
    responses: {
      '200': {
        description: 'Successfully retrieved dropdown list',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      value: { type: 'string', example: 'user-uuid-1234' },
                      name: { type: 'string', example: 'John Doe' }
                    }
                  }
                },
                pagination: {
                  type: 'object',
                  properties: {
                    total: { type: 'integer', example: 50 },
                    page: { type: 'integer', example: 1 },
                    pageSize: { type: 'integer', example: 10 },
                    totalPages: { type: 'integer', example: 5 }
                  }
                }
              }
            }
          }
        }
      },
      '500': {
        description: 'Server error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Server error. Dropdown list could not be retrieved.'
                }
              }
            }
          }
        }
      }
    }
  }
};
