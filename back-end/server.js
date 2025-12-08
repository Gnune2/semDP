//importa as dependencias
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

// declara variaveis para as importações
const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

//middlewares
const corsOptions = {
    origin: 'http://127.0.0.1:5500', // Apenas a sua origem frontend está permitida
    optionsSuccessStatus: 200 // Para navegadores mais antigos
};
app.use(cors(corsOptions));

//mostra o express que vai ser usado o json
app.use(express.json())
// inicializa server 
app.listen(PORT, () => {
    console.log(`Servidor inicializado com sucesso na porta ${PORT}`)
    console.log(`conectado ao mongoDB`)
})
//importa bcrypt
const bcrypt = require("bcrypt");
const saltRounds = 10;
//post cadastro
app.post("/cadastro", async(req, res) => {
    //espera dados
    const {studentName, email, password} = req.body
    //verifica se todos os dados foram preenchidos
    if (!studentName || !email || !password) {
        return res.status(400).json({error:"Todos os campos são obrigatórios."})
    }
    try {
        //procura se o email já foi usado
        const existingStudent = await prisma.student.findUnique({
            where:{email: email}
        });
        if (existingStudent){
            //se já foi usado a rota é finalzada com o return erro 409 conflito 
            return res.status(409).json({error: "Esse email já está sendo utilizado."})
        }
        //se todas as verificações forem feitas e nada de errado aconteceu o bcrypt criptografa a senha
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        //salva o usuario no mongoDB com a senha criptografada
        const newStudent = await prisma.student.create({
            data: {
                studentName: studentName,
                email: email,
                password: hashedPassword
            }
        })
        //reposta da rota depois dos dados inseridos no banco de dados (mongoDB)
        res.status(201).json({
            massage: "Registrado com Sucesso!",
            student : {
                id: newStudent.id,
                nome: newStudent.studentName,
                email: email
            }
        })
    }catch{
        //se algo der errado no lado do servidor
        console.error('Erro ao se registar:', error);
        // Código de status 500: Erro interno do servidor
        res.status(500).json({ error: 'Erro interno do servidor ao tentar registar.' });
    }
})