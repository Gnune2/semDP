const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware'); // Adicionado

// Rotas de Autenticação
router.post('/cadastro', authController.cadastro);
router.post('/login', authController.login);

// Rota de Perfil Adicionada
router.get('/perfil', authenticateToken, authController.obterPerfil);

module.exports = router;