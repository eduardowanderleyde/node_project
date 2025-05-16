const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Portfólio',
            version: '1.0.0',
            description: 'API REST para portfólio pessoal',
            contact: {
                name: 'Eduardo Wanderley',
                email: 'seu-email@exemplo.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de desenvolvimento'
            }
        ],
        components: {
            schemas: {
                Projeto: {
                    type: 'object',
                    required: ['id', 'nome', 'descricao', 'tecnologias'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID do projeto'
                        },
                        nome: {
                            type: 'string',
                            description: 'Nome do projeto'
                        },
                        descricao: {
                            type: 'string',
                            description: 'Descrição do projeto'
                        },
                        tecnologias: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Lista de tecnologias utilizadas'
                        }
                    }
                },
                Habilidade: {
                    type: 'object',
                    required: ['categoria', 'tecnologias'],
                    properties: {
                        categoria: {
                            type: 'string',
                            description: 'Categoria da habilidade'
                        },
                        tecnologias: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Lista de tecnologias'
                        }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js'], // Caminho para os arquivos com as anotações
};

module.exports = swaggerJsdoc(options); 