export const userGetDoc = {
        get: {
            summary: 'Get list of users with filtering, searching, and sorting',
            tags: ['Users'],
            parameters: [
                { name: 'page', in: 'query', schema: { type: 'integer' }, required: false },
                { name: 'pageSize', in: 'query', schema: { type: 'integer' }, required: false },
                { name: 'search', in: 'query', schema: { type: 'string' }, required: false },
            ],
            responses: {
                '200': { description: 'List of users' },
                '404': { description: 'No users found' },
                '500': { description: 'Server error' }
            }
        }
};