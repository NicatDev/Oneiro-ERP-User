export const loginDoc = {
    post: {
      summary: 'User login',
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                username: {
                  type: 'string',
                  example: 'admin1',
                },
                password: {
                  type: 'string',
                  example: '12345',
                },
              },
              required: ['username', 'password'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Operation success',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  access_token: {
                    type: 'string',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                  },
                  refresh_token: {
                    type: 'string',
                    example: 'dGhpc2lzYXJlZnJlc2h0b2tlbg==',
                  },
                },
              },
            },
          },
        },
        '401': {
          description: 'Username or password is not valid!',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Username or password is not valid!',
                  },
                },
              },
            },
          },
        },
        '500': {
          description: 'Server error!',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Server error!',
                  },
                },
              },
            },
          },
        },
      },
    },
};