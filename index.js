const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.get('/', (req, res) => {
    res.render('index', { title: 'Meu Portfólio' });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
}); 