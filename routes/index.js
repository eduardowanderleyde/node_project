const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Retorna informações da API
 *     description: Retorna informações básicas sobre a API do portfólio
 *     responses:
 *       200:
 *         description: Informações da API
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nome:
 *                   type: string
 *                   example: API de Portfólio
 *                 versao:
 *                   type: string
 *                   example: 1.0.0
 *                 descricao:
 *                   type: string
 *                   example: API REST para portfólio pessoal
 *             examples:
 *               exemplo:
 *                 value:
 *                   nome: API de Portfólio
 *                   versao: 1.0.0
 *                   descricao: API REST para portfólio pessoal
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro interno do servidor
 *                 message:
 *                   type: string
 *                   example: Mensagem detalhada do erro
 */
router.get('/api', (req, res) => {
    res.json({
        nome: 'API de Portfólio',
        versao: '1.0.0',
        descricao: 'API REST para portfólio pessoal'
    });
});

/**
 * @swagger
 * /api/projetos:
 *   get:
 *     summary: Retorna lista de projetos
 *     description: Retorna uma lista de todos os projetos do portfólio
 *     responses:
 *       200:
 *         description: Lista de projetos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Projeto'
 *             examples:
 *               exemplo:
 *                 value:
 *                   - id: 1
 *                     nome: Projeto 1
 *                     descricao: Descrição do projeto 1
 *                     tecnologias: ["Node.js", "Express", "MongoDB"]
 *                   - id: 2
 *                     nome: Projeto 2
 *                     descricao: Descrição do projeto 2
 *                     tecnologias: ["React", "TypeScript", "Firebase"]
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro interno do servidor
 *                 message:
 *                   type: string
 *                   example: Mensagem detalhada do erro
 */
router.get('/api/projetos', (req, res) => {
    const projetos = [
        {
            id: 1,
            nome: 'Projeto 1',
            descricao: 'Descrição do projeto 1',
            tecnologias: ['Node.js', 'Express', 'MongoDB']
        },
        {
            id: 2,
            nome: 'Projeto 2',
            descricao: 'Descrição do projeto 2',
            tecnologias: ['React', 'TypeScript', 'Firebase']
        }
    ];
    res.json(projetos);
});

/**
 * @swagger
 * /api/habilidades:
 *   get:
 *     summary: Retorna lista de habilidades
 *     description: Retorna uma lista de todas as habilidades técnicas
 *     responses:
 *       200:
 *         description: Lista de habilidades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Habilidade'
 *             examples:
 *               exemplo:
 *                 value:
 *                   - categoria: Frontend
 *                     tecnologias: ["HTML", "CSS", "JavaScript", "React"]
 *                   - categoria: Backend
 *                     tecnologias: ["Node.js", "Express", "MongoDB"]
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro interno do servidor
 *                 message:
 *                   type: string
 *                   example: Mensagem detalhada do erro
 */
router.get('/api/habilidades', (req, res) => {
    const habilidades = [
        {
            categoria: 'Frontend',
            tecnologias: ['HTML', 'CSS', 'JavaScript', 'React']
        },
        {
            categoria: 'Backend',
            tecnologias: ['Node.js', 'Express', 'MongoDB']
        }
    ];
    res.json(habilidades);
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verifica o status da API
 *     description: Retorna o status atual da API
 *     responses:
 *       200:
 *         description: Status da API
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: online
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *             examples:
 *               exemplo:
 *                 value:
 *                   status: online
 *                   timestamp: "2024-05-16T20:00:00.000Z"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro interno do servidor
 *                 message:
 *                   type: string
 *                   example: Mensagem detalhada do erro
 */
router.get('/health', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString()
    });
});

module.exports = router; 