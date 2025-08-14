export const authSchemas = {
    login: {
        tags: ['auth'],
        summary: 'User login',
        description: 'Authenticate user with email and password',
        body: {
            type: 'object',
            properties: {
                email: {type: 'string'},
                password: {type: 'string'}
            }
        },
    },

    register: {
        tags: ['auth'],
        summary: 'User registration',
        description: 'Register a new user account',
        body: {
            type: 'object',
            properties: {
                username: {type: 'string'},
                email: {type: 'string'},
                password: {type: 'string'}
            }
        }
    },

    validate: {
        tags: ['auth'],
        summary: 'Token validation',
        description: 'Validate JWT token and get user information',
        headers: {
            type: 'object',
            properties: {
                authorization: {type: 'string'}
            }
        }
    }
};

export const userSchemas = {
    update: {
        tags: ['user'],
        summary: 'Update user',
        description: 'Update user information',
        params: {
            type: 'object',
            properties: {
                uuid: {type: 'string'}
            }
        },
        body: {
            type: 'object',
            properties: {
                username: {type: 'string'},
                email: {type: 'string'},
                password: {type: 'string'},
                new_password: {type: 'string'}
            }
        }
    }
};

export const systemSchemas = {
    health: {
        tags: ['system'],
        summary: 'Health check',
        description: 'Check if the authentication service is running'
    }
};
