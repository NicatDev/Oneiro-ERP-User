export const moduleCreateDoc = {
  post: {
    summary: 'Create a new module',
    description: 'Creates a new module with the provided details.',
    tags: ['Modules'],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['name', 'path'],
            properties: {
              name: { type: 'string', example: 'Inventory' },
              description: { type: 'string', example: 'Manages inventory items and stock levels.' },
              icon: { type: 'string', example: 'inventory-icon.svg' },
              path: { type: 'string', example: '/inventory' },
            },
          },
        },
      },
    },
    responses: {
      '201': {
        description: 'Module created successfully',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                uuid: { type: 'string', example: 'module-uuid-123' },
                name: { type: 'string', example: 'Inventory' },
                description: { type: 'string', example: 'Manages inventory items and stock levels.' },
                icon: { type: 'string', example: 'inventory-icon.svg' },
                path: { type: 'string', example: '/inventory' },
              },
            },
          },
        },
      },
      '400': {
        description: 'Missing required fields',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Name and path are required.',
                },
              },
            },
          },
        },
      },
      '500': {
        description: 'Server error while creating module',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Modul yaradılarkən server xətası baş verdi.',
                },
              },
            },
          },
        },
      },
    },
  },
};
