# API de Portfólio Pessoal

Este é um projeto de API REST para portfólio pessoal desenvolvido com Node.js e Express.

## Tecnologias Utilizadas

- Node.js
- Express
- Jest (para testes)
- Supertest (para testes de API)
- Morgan (para logging)
- Helmet (para segurança)
- CORS (para controle de acesso)

## Instalação

1. Clone o repositório

```bash
git clone https://github.com/eduardowanderleyde/node_project.git
```

2. Instale as dependências

```bash
npm install
```

3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

4. Execute o projeto

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## Endpoints da API

### GET /

- Retorna informações básicas da API

### GET /api/projetos

- Retorna lista de projetos

### GET /api/habilidades

- Retorna lista de habilidades

### GET /health

- Verifica o status da API

## Estrutura do Projeto

- `/routes` - Rotas da API
- `/controllers` - Controladores da aplicação
- `/middlewares` - Middlewares personalizados
- `/tests` - Testes automatizados

## Testes

```bash
npm test
```

## Licença

ISC
