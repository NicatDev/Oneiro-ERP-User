export const moduleDoc = {
  get: {
    summary: 'Get modules',
    description: 'Retrieves a list of modules without any associated forms.',
    tags: ['Modules'],
    responses: {
      '200': {
        description: 'List of modules',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  uuid: { type: 'string', example: 'module-uuid-123' },
                  name: { type: 'string', example: 'Module Name' },
                  description: { type: 'string', example: 'Module description here' },
                  icon: { type: 'string', example: 'module-icon.svg' },
                  path: { type: 'string', example: '/module-path' },
                },
              },
            },
          },
        },
      },
      '500': {
        description: 'Server error while fetching modules',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Modullar gətirilərkən xəta baş verdi.',
                },
              },
            },
          },
        },
      },
    },
  },
};