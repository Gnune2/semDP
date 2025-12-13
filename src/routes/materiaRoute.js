const express = require('express');
const router = express.Router();
const materiaController = require('../controllers/materiaController');
const authenticateToken = require('../middlewares/authMiddleware');

// Rotas de Matéria (Todas protegidas pelo Token)
// OBS: No server.js vamos definir que essa rota começa com /materia, então aqui usamos apenas /
router.post('/', authenticateToken, materiaController.criarMateria);
router.get('/', authenticateToken, materiaController.listarMaterias);

module.exports = router;