export const tournamentSchemas = {
    create: {
        tags: ['tournament'],
        summary: 'Create tournament',
        description: 'Create a new tournament',
        headers: {
            type: 'object',
            properties: {
                authorization: {type: 'string'}
            }
        },
        body: {
            type: 'object',
            properties: {
                name: {type: 'string'}
            }
        }
    },

    join: {
        tags: ['tournament'],
        summary: 'Join tournament',
        description: 'Join a tournament using its code',
        headers: {
            type: 'object',
            properties: {
                authorization: {type: 'string'}
            }
        },
        params: {
            type: 'object',
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
            properties: {
                authorization: {type: 'string'}
            }
        },
        params: {
            type: 'object',
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
            properties: {
                authorization: {type: 'string'}
            }
        },
        params: {
            type: 'object',
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
            properties: {
                authorization: {type: 'string'}
            }
        },
        params: {
            type: 'object',
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
            properties: {
                authorization: {type: 'string'}
            }
        }
    },

    addWinners: {
        tags: ['tournament'],
        summary: 'Add winners',
        description: 'Add winners to new round of a tournament',
        params: {
            type: 'object',
            properties: {
                code: {type: 'string'}
            }
        },
        body: {
            type: 'object',
            properties: {
                round_number: {type: 'number'},
                winner: {
                    type: 'object',
                    properties: {
                        uuid: {type: 'string'},
                        username: {type: 'string'},
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
            properties: {
                code: {type: 'string'}
            }
        },
        body: {
            type: 'object',
            properties: {
                round_number: {type: 'number'},
                participant: {
                    type: 'object',
                    properties: {
                        uuid: {type: 'string'},
                        username: {type: 'string'},
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
            properties: {
                code: {type: 'string'}
            }
        },
        body: {
            type: 'object',
            properties: {
                round_number: {type: 'number'},
                participant: {
                    type: 'object',
                    properties: {
                        uuid: {type: 'string'},
                        username: {type: 'string'},
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
