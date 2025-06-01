export const resetPasswordDoc = {
  put: {
    summary: 'Reset user password',
    description: 'Resets the password of a user by hashing the new password and saving it to the database.',
    tags: ['Users'],
    parameters: [
      {
        name: 'uuid',
        in: 'path',
        required: true,
        schema: { type: 'string' },
        description: 'UUID of the user whose password will be reset',
        example: 'user-uuid-1234'
      }
    ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['password_hash'],
            properties: {
              password_hash: {
                type: 'string',
                example: 'newSecurePassword123'
              }
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: 'Password successfully reset',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Şifrə uğurla yeniləndi.'
                }
              }
            }
          }
        }
      },
      '400': {
        description: 'Invalid or missing data',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Yeni şifrə göndərilməlidir.'
                }
              }
            }
          }
        }
      },
      '404': {
        description: 'User not found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'İstifadəçi tapılmadı.'
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
                  example: 'Server xətası baş verdi. Şifrə yenilənmədi.'
                }
              }
            }
          }
        }
      }
    }
  }
};
