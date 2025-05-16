const express = require('express');
const router = express.Router();

// Rota principal
router.get('/', (req, res) => {
    res.json({
        message: 'API do Portfólio',
        status: 'online',
        version: '1.0.0'
    });
});

// Rota de projetos
router.get('/projetos', (req, res) => {
    res.json({
        projetos: [
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
                tecnologias: ['React', 'Node.js', 'PostgreSQL']
            }
        ]
    });
});

// Rota de habilidades
router.get('/habilidades', (req, res) => {
    res.json({
        habilidades: [
            {
                categoria: 'Backend',
                tecnologias: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL']
            },
            {
                categoria: 'Frontend',
                tecnologias: ['React', 'HTML', 'CSS', 'JavaScript']
            }
        ]
    });
});

module.exports = router; 