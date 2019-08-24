const express = require('express');
const server = express();
const port = process.env.PORT || 3000;
const projects = [];
let countRequest = 1;

server.use(express.json());

function logRequests(req, res, next) {
  console.log(`Req n°${countRequest++}`)
  next();
};

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const projectIndex = projects.findIndex(project => project.id === id);
  if (projectIndex < 0) {
    return res.status(404).send('Project doesn\'t exists');
  }
  next();
}

server.use(logRequests);

server.get('/projects', (req, res) => {
  res.json(projects)
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(project => project.id === id);
  project.title = title;
  res.json(project);
});

server.post('/projects', (req, res) => {
  const { id, title} = req.body;
  projects.push({
    id,
    title,
    tasks: [],
  })
  res.status(201).send();
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(project => project.id === id);
  projects.splice(projectIndex, 1);
  res.status(204).send();
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(project => project.id === id);
  project.tasks.push(title);
  res.json(project)
});

server.listen(port, () => {
  console.log(`Running on port ${port}`);
});
