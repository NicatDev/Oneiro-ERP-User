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
                            required: ['first_name', 'last_name', 'username', 'password_hash'],
                            properties: {
                                first_name: { type: 'string' },
                                last_name: { type: 'string' },
                                username: { type: 'string' },
                                email: { type: 'string' },
                                phone_number: { type: 'string' },
                                password_hash: { type: 'string' },
                                is_active: { type: 'boolean' }
                            }
                        }
                    }
                }
            },
            responses: {
                '201': {
                    description: 'User successfully created'
                },
                '400': {
                    description: 'Missing required fields'
                },
                '500': {
                    description: 'Server error'
                }
            }
        }
};