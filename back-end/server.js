//importa as dependencias
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const jwt = require('jsonwebtoken');

// declara variaveis para as importações
const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

//middlewares
//token
const authenticateToken = require('./authMiddleware.js'); 
//cors
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

//rota para login
app.post("/login", async(req, res) =>{
    //variavel que extrai dados do enviados do front
    const {password, email} = req.body
    //verifica se todos os campos foram enviados
    if (!password || !email) {
        return res.status(400).json({error:"Email e senha são obrigatórios."})
    }
    //try para a execução com return se alguma verificação mostrar uma falha, caso ao contrário o login é efetudado
    try {
        //verifica se o email existe no banco
        const student = await prisma.student.findUnique({
            where: {email: email},
        })
        if(!student){
            return res.status(401).json({error: "Email não encontrado"})
        }
        //compara a senha do email que foi requisitado com bcrypt
        const isPasswordValid = await bcrypt.compare(password, student.password);
        //se a senha for validada
        if(isPasswordValid){
            //cria token
            const tokenPayLoad = {
                studentId: student.id,
                email: student.email,
                name: student.studentName
            };
            const token = jwt.sign(
                tokenPayLoad,
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            //e responde com status 200, json com mensagem de sucesso, token...
            res.status(200).json({
                massage: "Login bem-sucedido! Bem-vindo(a).",
                token: token,
                student: {
                    id: student.id,           
                    username: student.studentName, 
                    email: student.email, 
                },
            })
        }else{
            //se a senha não for validade erro 401 
            return res.status(401),json({error: "Senha incorreta"})
        }
    }catch (error){
        // se for erro no servidor.
        console.error('Erro no processo de login:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao tentar fazer login.' });
    }
})
//rota teste para middleware do token
//Rota protegida: O Middleware é executado primeiro!
app.post('/materia', authenticateToken, async (req, res) => {
    // Se esta função for executada, o Token foi validado.
    const { name, image, assessments } = req.body;

    const studentId = req.student.studentId;
    
    if(!name){
        return res.status(400).json({error: "O nome da matéria é obrigatório"})
    }
    try {
        const newSubject = await prisma.subject.create({
            data: {
                name: name,
                image: image || "",
                student: {
                    connect: { id: studentId }
                },
                assessments: {
                    create: assessments
                }
            },
            include: {
                assessments: true
            }
        })
        res.status(201).json({
            message: "Matéria criado com sucesso!",
            subject: newSubject
        })
    } catch (error) {
        console.error("Erro ao criar matéria:", error);
        res.status(500).json({ error: "Erro interno ao salvar a matéria."})
    }
});