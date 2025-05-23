export const refreshDoc = {
        post: {
            summary: 'Refresh access token',
            description: 'Accepts a valid, non-revoked refresh token and returns a new access token.',
            tags: ['Auth'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['refresh_token'],
                            properties: {
                                refresh_token: {
                                    type: 'string',
                                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Successfully issued a new access token',
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
                                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                                    },
                                },
                            },
                        },
                    },
                },
                '400': {
                    description: 'Refresh token is missing in the request',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string',
                                        example: 'Refresh token is required',
                                    },
                                },
                            },
                        },
                    },
                },
                '401': {
                    description: 'Token could not be verified (Unauthorized)',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string',
                                        example: 'Unauthorized',
                                    },
                                },
                            },
                        },
                    },
                },
                '403': {
                    description: 'Refresh token is invalid or revoked',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string',
                                        example: 'Invalid or revoked refresh token',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
};