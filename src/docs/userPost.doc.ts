export const userPostDoc = {
  post: {
    summary: 'Create a new user',
    tags: ['Users'],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['first_name', 'last_name', 'username', 'email', 'password_hash'],
            properties: {
              first_name: { type: 'string', example: 'John' },
              last_name: { type: 'string', example: 'Doe' },
              username: { type: 'string', example: 'johndoe123' },
              email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
              phone_number: { type: 'string', example: '+1234567890' },
              password_hash: { type: 'string', minLength: 5, example: 'strongpassword' },
              is_active: { type: 'boolean', example: true }
            }
          }
        }
      }
    },
    responses: {
      '201': {
        description: 'User successfully created',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                uuid: { type: 'string', format: 'uuid' },
                first_name: { type: 'string' },
                last_name: { type: 'string' },
                username: { type: 'string' },
                email: { type: 'string', format: 'email' },
                phone_number: { type: 'string', nullable: true },
                created_at: { type: 'string', format: 'date-time' },
                password_hash: { type: 'string' },
                is_active: { type: 'boolean' }
              }
            }
          }
        }
      },
      '400': {
        description: 'Validation error or user with same username/email already exists',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'Username is already in use.' }
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
                message: { type: 'string', example: 'An error occurred while creating the user.' }
              }
            }
          }
        }
      }
    }
  }
};