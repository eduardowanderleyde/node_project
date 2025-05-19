const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        nome: 'API de Portfólio',
        versao: '1.0.0',
        descricao: 'API REST para portfólio pessoal'
    });
});

router.get('/projetos', (req, res) => {
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
    res.json({ projetos }); // Envelopa no objeto
});

router.get('/habilidades', (req, res) => {
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
    res.json({ habilidades }); // Envelopa no objeto
});

router.get('/health', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
