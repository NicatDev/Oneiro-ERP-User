export const userSingleGetDoc = {
  get: {
    summary: 'Get a single user by UUID',
    description: 'Retrieves the details of a specific user using their UUID.',
    tags: ['Users'],
    parameters: [
      {
        name: 'uuid',
        in: 'path',
        required: true,
        schema: { type: 'string' },
        description: 'UUID of the user',
        example: 'user-uuid-1234'
      }
    ],
    responses: {
      '200': {
        description: 'User data successfully retrieved',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                uuid: { type: 'string', example: 'user-uuid-1234' },
                first_name: { type: 'string', example: 'John' },
                last_name: { type: 'string', example: 'Doe' },
                username: { type: 'string', example: 'johndoe' },
                email: { type: 'string', example: 'john@example.com' },
                phone_number: { type: 'string', example: '+123456789' },
                is_active: { type: 'boolean', example: true },
                created_at: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' }
              }
            }
          }
        }
      },
      '400': {
        description: 'UUID parametresi eksik veya geçersiz',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'UUID parametresi gereklidir.' }
              }
            }
          }
        }
      },
      '404': {
        description: 'Kullanıcı bulunamadı',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'Kullanıcı bulunamadı.' }
              }
            }
          }
        }
      },
      '500': {
        description: 'Sunucu hatası',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'Kullanıcı getirilemedi. Sunucu hatası oluştu.' }
              }
            }
          }
        }
      }
    }
  }
};