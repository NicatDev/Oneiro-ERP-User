export const userColumnGetDoc = {
        get: {
            summary: 'Get distinct values of a user field for filtering',
            tags: ['Users'],
            parameters: [
                {
                    name: 'field',
                    in: 'query',
                    required: true,
                    schema: {
                        type: 'string',
                        enum: ['first_name', 'last_name', 'email', 'username', 'phone_number', 'is_active']
                    }
                }
            ],
            responses: {
                '200': {
                    description: 'Distinct values returned'
                },
                '400': {
                    description: 'Invalid or missing field parameter'
                },
                '500': {
                    description: 'Server error'
                }
            }
        }
};