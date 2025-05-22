const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Project = require('../src/models/Project');
const Skill = require('../src/models/Skill');

let token;

// Função auxiliar para registrar e logar um usuário de teste
async function getToken() {
  const user = { email: 'apitest@example.com', password: 'senha123' };
  await request(app).post('/api/auth/register').send(user);
  const res = await request(app).post('/api/auth/login').send(user);
  return res.body.token;
}

beforeAll(async () => {
  token = await getToken();
});

// Limpar o banco de dados antes dos testes
beforeEach(async () => {
  await Project.deleteMany({});
  await Skill.deleteMany({});
});

// Portfolio API test suite
describe('API de Portfólio', () => {
  // Testes de rotas básicas
  describe('Rotas Básicas', () => {
    it('deve retornar mensagem de boas-vindas', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.text).toBe('API Portfolio is running');
    });

    it('deve retornar status ok', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
    });
  });

  // Testes de Projetos
  describe('Projetos', () => {
    const projetoTeste = {
      title: 'Projeto Teste',
      description: 'Descrição do projeto teste',
      technologies: ['Node.js', 'Express'],
      imageUrl: 'http://exemplo.com/imagem.jpg',
      projectUrl: 'http://exemplo.com/projeto'
    };

    it('deve criar um novo projeto', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send(projetoTeste);
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.title).toBe(projetoTeste.title);
    });

    it('deve retornar lista de projetos', async () => {
      await Project.create(projetoTeste);
      
      const res = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe(projetoTeste.title);
    });

    it('deve retornar erro ao criar projeto sem campos obrigatórios', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({});
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('deve retornar erro ao criar projeto com dados inválidos', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 123, // título deve ser string
          description: true, // descrição deve ser string
          technologies: 'não é um array' // technologies deve ser array
        });
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('validation failed');
    });

    it('deve retornar erro ao buscar projeto inexistente', async () => {
      const idInexistente = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/projects/${idInexistente}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Not found');
    });

    it('deve retornar erro ao atualizar projeto inexistente', async () => {
      const idInexistente = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/projects/${idInexistente}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Novo Título' });
      
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Not found');
    });

    it('deve retornar erro ao deletar projeto inexistente', async () => {
      const idInexistente = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/projects/${idInexistente}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Not found');
    });

    it('deve atualizar um projeto existente', async () => {
      const projeto = await Project.create(projetoTeste);
      const atualizacao = { title: 'Projeto Atualizado' };

      const res = await request(app)
        .put(`/api/projects/${projeto._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(atualizacao);

      expect(res.status).toBe(200);
      expect(res.body.title).toBe(atualizacao.title);
    });

    it('deve deletar um projeto', async () => {
      const projeto = await Project.create(projetoTeste);

      const res = await request(app)
        .delete(`/api/projects/${projeto._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      
      const projetoDeletado = await Project.findById(projeto._id);
      expect(projetoDeletado).toBeNull();
    });
  });

  // Testes de Habilidades
  describe('Habilidades', () => {
    const habilidadeTeste = {
      name: 'JavaScript',
      level: 'Avançado',
      category: 'Frontend'
    };

    it('deve criar uma nova habilidade', async () => {
      const res = await request(app)
        .post('/api/skills')
        .set('Authorization', `Bearer ${token}`)
        .send(habilidadeTeste);
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toBe(habilidadeTeste.name);
    });

    it('deve retornar lista de habilidades', async () => {
      await Skill.create(habilidadeTeste);
      
      const res = await request(app)
        .get('/api/skills')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe(habilidadeTeste.name);
    });

    it('deve retornar erro ao criar habilidade sem campos obrigatórios', async () => {
      const res = await request(app)
        .post('/api/skills')
        .set('Authorization', `Bearer ${token}`)
        .send({});
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('deve retornar erro ao criar habilidade com dados inválidos', async () => {
      const res = await request(app)
        .post('/api/skills')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 123, // nome deve ser string
          level: true, // level deve ser string
          category: [] // category deve ser string
        });
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('deve retornar erro ao buscar habilidade inexistente', async () => {
      const idInexistente = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/skills/${idInexistente}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Not found');
    });

    it('deve retornar erro ao atualizar habilidade inexistente', async () => {
      const idInexistente = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/skills/${idInexistente}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ level: 'Expert' });
      
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Not found');
    });

    it('deve retornar erro ao deletar habilidade inexistente', async () => {
      const idInexistente = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/skills/${idInexistente}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Not found');
    });

    it('deve atualizar uma habilidade existente', async () => {
      const habilidade = await Skill.create(habilidadeTeste);
      const atualizacao = { level: 'Expert' };

      const res = await request(app)
        .put(`/api/skills/${habilidade._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(atualizacao);

      expect(res.status).toBe(200);
      expect(res.body.level).toBe(atualizacao.level);
    });

    it('deve deletar uma habilidade', async () => {
      const habilidade = await Skill.create(habilidadeTeste);

      const res = await request(app)
        .delete(`/api/skills/${habilidade._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      
      const habilidadeDeletada = await Skill.findById(habilidade._id);
      expect(habilidadeDeletada).toBeNull();
    });
  });

  // Testes de Erro
  describe('Tratamento de Erros', () => {
    it('deve retornar 404 para rota inexistente', async () => {
      const res = await request(app).get('/rota-inexistente');
      expect(res.status).toBe(404);
    });

    it('deve retornar 400 para ID inválido', async () => {
      const res = await request(app)
        .get('/api/projects/id-invalido')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(400);
    });

    it('deve retornar 401 para rota protegida sem token', async () => {
      const res = await request(app).get('/api/projects');
      expect(res.status).toBe(401);
    });

    it('deve retornar 401 para rota protegida com token inválido', async () => {
      const res = await request(app)
        .get('/api/projects')
        .set('Authorization', 'Bearer token-invalido');
      expect(res.status).toBe(401);
    });
  });
});

// Limpar conexão após todos os testes
afterAll(async () => {
  await mongoose.connection.close();
}); 