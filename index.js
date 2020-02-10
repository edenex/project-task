const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

/**
 * Middleware que verifica se o projeto existe
 */
function checkProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  if(!project) {
    return res.status(400).json({ error: 'Project not found!' });
  }

  return next();
}

/**
 * Middleware que verifica se existe o título do projeto
 */
function checkTitleProjectExists(req, res, next) {
  if(!req.body.title) {
    return res.status(400).json({ error: 'The project name is required!' });
  }

  return next();
}

/**
 * Middleware que verifica se existe o título da tarefa do projeto
 */
function checkTitleTaskProjectExists(req, res, next) {
  if(!req.body.title) {
    return res.status(400).json({ error: 'Error in task title!' });
  }

  return next();
}

/**
 * Verifica se o título da tarefa de um projeto está vazia
 */
function checkTaskTitleIsEmpty(req, res, next) {
  if(req.body.title < 1) {
    return res.status(400).json({ error: 'Task title is empty!' });
  }

  return next();
}

/**
 * Middleware global (Dá log no número de requisições)
 */
function logRequests(req, res, next) {
  console.count("Número de requisições");

  return next();
}

server.use(logRequests);

/**
 * Criar um novo projeto
 */
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  // O método push (empurrar) anexa novos elementos a uma matriz e retorna o novo comprimento da matriz.
  projects.push(project);

  return res.json(project);
});

/**
 * Listar todos os projetos
 */
server.get('/projects', (req, res) => {
  return res.json(projects);
});

/**
 * Listar um projeto específicio
 */
server.get('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  
  const project = projects.find(p => p.id == id);

  return res.json(project);
});

/**
 * Alterar o título de um projeto com base no id do projeto
 */
server.put('/projects/:id', checkProjectExists, checkTitleProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

/**
 * Deletar um projeto com base no id
 */
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectId = projects.findIndex(p => p.id == id);

  projects.splice(projectId, 1);

  return res.status(200).json({ message: "Project successfully deleted!" });
});

/**
 * Criar tarefas em um projeto específico
 */
server.post('/projects/:id/tasks', checkProjectExists, checkTitleTaskProjectExists, checkTaskTitleIsEmpty, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);