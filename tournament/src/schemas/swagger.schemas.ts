export const tournamentSchemas = {
    create: {
        tags: ['tournament'],
        summary: 'Create tournament',
        description: 'Create a new tournament',
        headers: {
            type: 'object',
            required: ['authorization'],
            properties: {
                authorization: {type: 'string', pattern: '^Bearer .+'}
            }
        },
        body: {
            type: 'object',
            required: ['name'],
            properties: {
                name: {type: 'string', minLength: 1, maxLength: 100}
            }
        }
    },

    join: {
        tags: ['tournament'],
        summary: 'Join tournament',
        description: 'Join a tournament using its code',
        headers: {
            type: 'object',
            required: ['authorization'],
            properties: {
                authorization: {type: 'string', pattern: '^Bearer .+'}
            }
        },
        params: {
            type: 'object',
            required: ['code'],
            properties: {
                code: {type: 'string'}
            }
        }
    },

    leave: {
        tags: ['tournament'],
        summary: 'Leave tournament',
        description: 'Leave a tournament using its code',
        headers: {
            type: 'object',
            required: ['authorization'],
            properties: {
                authorization: {type: 'string', pattern: '^Bearer .+'}
            }
        },
        params: {
            type: 'object',
            required: ['code'],
            properties: {
                code: {type: 'string'}
            }
        }
    },

    delete: {
        tags: ['tournament'],
        summary: 'Delete tournament',
        description: 'Delete a tournament using its code',
        headers: {
            type: 'object',
            required: ['authorization'],
            properties: {
                authorization: {type: 'string', pattern: '^Bearer .+'}
            }
        },
        params: {
            type: 'object',
            required: ['code'],
            properties: {
                code: {type: 'string'}
            }
        }
    },

    start: {
        tags: ['tournament'],
        summary: 'Start tournament',
        description: 'Start a tournament using its code',
        headers: {
            type: 'object',
            required: ['authorization'],
            properties: {
                authorization: {type: 'string', pattern: '^Bearer .+'}
            }
        },
        params: {
            type: 'object',
            required: ['code'],
            properties: {
                code: {type: 'string'}
            }
        }
    },

    get: {
        tags: ['tournament'],
        summary: 'Get tournament',
        description: 'Get tournament by code',
        params: {
            type: 'object',
            required: ['code'],
            properties: {
                code: {type: 'string'}
            }
        }
    },

    getByUUID: {
        tags: ['tournament'],
        summary: 'Get tournament by UUID',
        description: 'Get tournament by participant UUID',
        headers: {
            type: 'object',
            required: ['authorization'],
            properties: {
                authorization: {type: 'string', pattern: '^Bearer .+'}
            }
        }
    },

    addWinners: {
        tags: ['tournament'],
        summary: 'Add winners',
        description: 'Add winners to new round of a tournament',
        params: {
            type: 'object',
            required: ['code'],
            properties: {
                code: {type: 'string'}
            }
        },
        body: {
            type: 'object',
            required: ['round_number', 'winner'],
            properties: {
                round_number: {type: 'number', minimum: 1},
                winner: {
                    type: 'object',
                    required: ['uuid', 'username'],
                    properties: {
                        uuid: {type: 'string', format: 'uuid'},
                        username: {type: 'string'},
                        status: {type: 'string', enum: ['disconnected', 'joined']}
                    }
                }
            }
        }
    },

    joinMatch: {
        tags: ['tournament'],
        summary: 'Join match',
        description: 'Join a match in a tournament',
        params: {
            type: 'object',
            required: ['code'],
            properties: {
                code: {type: 'string'}
            }
        },
        body: {
            type: 'object',
            required: ['round_number', 'participant'],
            properties: {
                round_number: {type: 'number', minimum: 1},
                participant: {
                    type: 'object',
                    required: ['uuid', 'username'],
                    properties: {
                        uuid: {type: 'string', format: 'uuid'},
                        username: {type: 'string'},
                        status: {type: 'string', enum: ['disconnected', 'joined']}
                    }
                }
            }
        }
    },

    leaveMatch: {
        tags: ['tournament'],
        summary: 'Leave match',
        description: 'Leave a match in a tournament',
        params: {
            type: 'object',
            required: ['code'],
            properties: {
                code: {type: 'string'}
            }
        },
        body: {
            type: 'object',
            required: ['round_number', 'participant'],
            properties: {
                round_number: {type: 'number', minimum: 1},
                participant: {
                    type: 'object',
                    required: ['uuid', 'username'],
                    properties: {
                        uuid: {type: 'string', format: 'uuid'},
                        username: {type: 'string'},
                        status: {type: 'string', enum: ['disconnected', 'joined']}
                    }
                }
            }
        }
    }
};

export const systemSchemas = {
    health: {
        tags: ['system'],
        summary: 'Health check',
        description: 'Check if the tournament service is running'
    }
};
