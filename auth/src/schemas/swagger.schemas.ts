export const authSchemas = {
    login: {
        tags: ['auth'],
        summary: 'User login',
        description: 'Authenticate user with email and password',
        body: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
                email: {type: 'string', format: 'email', minLength: 5, maxLength: 50},
                password: {type: 'string', minLength: 6, maxLength: 25}
            }
        },
    },

    register: {
        tags: ['auth'],
        summary: 'User registration',
        description: 'Register a new user account',
        body: {
            type: 'object',
            required: ['username', 'email', 'password'],
            properties: {
                username: {type: 'string', minLength: 3, maxLength: 20},
                email: {type: 'string', format: 'email', minLength: 5, maxLength: 50},
                password: {type: 'string', minLength: 6, maxLength: 25}
            }
        }
    },

    validate: {
        tags: ['auth'],
        summary: 'Token validation',
        description: 'Validate JWT token and get user information',
        headers: {
            type: 'object',
            required: ['authorization'],
            properties: {
                authorization: {type: 'string', pattern: '^Bearer .+'}
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
            required: ['uuid'],
            properties: {
                uuid: {type: 'string', format: 'uuid'}
            }
        },
        body: {
            type: 'object',
            properties: {
                username: {type: 'string', minLength: 3, maxLength: 20},
                email: {type: 'string', format: 'email', minLength: 5, maxLength: 50},
                password: {type: 'string', minLength: 6, maxLength: 25}
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
