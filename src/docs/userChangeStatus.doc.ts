export const userChangeStatusDoc = {
        put: {
            summary: 'Change user active status',
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
                            required: ['is_active'],
                            properties: {
                                is_active: { type: 'boolean' }
                            }
                        }
                    }
                }
            },
            responses: {
                '200': {
                    description: 'User status updated'
                },
                '400': {
                    description: 'Invalid input'
                },
                '404': {
                    description: 'User not found'
                },
                '500': {
                    description: 'Server error'
                }
            }
        }
};