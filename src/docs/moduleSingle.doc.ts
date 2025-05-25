export const moduleSingleDoc = {
  get: {
    summary: 'Get a single module with its forms',
    description: 'Retrieves a module by UUID along with all associated forms.',
    tags: ['Modules'],
    parameters: [
      {
        name: 'uuid',
        in: 'path',
        required: true,
        description: 'UUID of the module',
        schema: {
          type: 'string',
          example: 'module-uuid-123',
        },
      },
    ],
    responses: {
      '200': {
        description: 'Module with its associated forms',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                module: {
                  type: 'object',
                  properties: {
                    uuid: { type: 'string', example: 'module-uuid-123' },
                    name: { type: 'string', example: 'Module Name' },
                    description: { type: 'string', example: 'Module description here' },
                    icon: { type: 'string', example: 'module-icon.svg' },
                    path: { type: 'string', example: '/module-path' },
                  },
                },
                forms: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      uuid: { type: 'string', example: 'form-uuid-456' },
                      module_uuid: { type: 'string', example: 'module-uuid-123' },
                      name: { type: 'string', example: 'Form Name' },
                      description: { type: 'string', example: 'Form description here' },
                      icon: { type: 'string', example: 'form-icon.svg' },
                      path: { type: 'string', example: '/form-path' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '400': {
        description: 'UUID parametresi eksik',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Module UUID gereklidir.',
                },
              },
            },
          },
        },
      },
      '404': {
        description: 'Modül bulunamadı',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Modül bulunamadı.',
                },
              },
            },
          },
        },
      },
      '500': {
        description: 'Server error while fetching the module and its forms',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Sunucu hatası.',
                },
              },
            },
          },
        },
      },
    },
  },
};