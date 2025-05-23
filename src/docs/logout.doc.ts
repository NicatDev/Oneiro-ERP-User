export const logoutDoc = {
        post: {
            summary: 'Logout user by revoking refresh token',
            description: 'Revokes the provided refresh token, logging the user out.',
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
                    description: 'Successfully logged out',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string',
                                        example: 'Log out',
                                    },
                                },
                            },
                        },
                    },
                },
                '400': {
                    description: 'Token is not valid',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string',
                                        example: 'Token is not valid',
                                    },
                                },
                            },
                        },
                    },
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
                                        example: 'Server error',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
};