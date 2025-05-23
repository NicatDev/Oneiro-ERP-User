export const userPutDoc = {
        patch: {
            summary: 'Update a user by UUID',
            tags: ['Users'],
            parameters: [
                {
                    name: 'uuid',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                first_name: { type: 'string' },
                                last_name: { type: 'string' },
                                email: { type: 'string' },
                                username: { type: 'string' }
                            }
                        }
                    }
                }
            },
            responses: {
                '200': { description: 'User updated successfully' },
                '400': { description: 'Invalid input or missing UUID' },
                '404': { description: 'User not found' },
                '500': { description: 'Server error' }
            }
        }
};