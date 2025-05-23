export const moduleDoc = {
        get: {
            summary: 'Get modules with their associated forms',
            description: 'Retrieves a list of modules, each including its related forms if any exist.',
            tags: ['Modules'],
            responses: {
                '200': {
                    description: 'List of modules with nested forms',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        uuid: { type: 'string', example: 'module-uuid-123' },
                                        name: { type: 'string', example: 'Module Name' },
                                        description: { type: 'string', example: 'Module description here' },
                                        icon: { type: 'string', example: 'module-icon.svg' },
                                        path: { type: 'string', example: '/module-path' },
                                        forms: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    uuid: { type: 'string', example: 'form-uuid-456' },
                                                    name: { type: 'string', example: 'Form Name' },
                                                    description: { type: 'string', example: 'Form description here' },
                                                    icon: { type: 'string', example: 'form-icon.svg' },
                                                    path: { type: 'string', example: '/form-path' },
                                                },
                                            },
                                            example: [],
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                '500': {
                    description: 'Server error while fetching modules and forms',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string',
                                        example: 'Modul və formalar gətirilərkən xəta baş verdi.',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
}
