const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

// Importação das Rotas
const authRoutes = require('./routes/authRoutes');
const materiaRoutes = require('./routes/materiaRoutes');

// Configurações Globais
// const corsOptions = {
//     origin: 'http://127.0.0.1:5500', 
//     optionsSuccessStatus: 200 
// };

// app.use(cors(corsOptions));
app.use(express.json());

// Definição das Rotas
app.use('/', authRoutes); // Isso vai criar /login e /cadastro
app.use('/materia', materiaRoutes); // Isso vai criar /materia (GET e POST)

// Inicialização
app.listen(PORT, () => {
    console.log(`Servidor inicializado com sucesso na porta ${PORT}`);
    console.log(`Conectado ao Banco de Dados`);
});