const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma'); // Importa nossa conexão configurada
const saltRounds = 10;

exports.cadastro = async (req, res) => {
    const { studentName, email, password } = req.body;

    if (!studentName || !email || !password) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    try {
        const existingStudent = await prisma.student.findUnique({
            where: { email: email }
        });

        if (existingStudent) {
            return res.status(409).json({ error: "Esse email já está sendo utilizado." });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newStudent = await prisma.student.create({
            data: {
                studentName: studentName,
                email: email,
                password: hashedPassword
            }
        });

        res.status(201).json({
            message: "Registrado com Sucesso!",
            student: {
                id: newStudent.id,
                nome: newStudent.studentName,
                email: email
            }
        });
    } catch (error) {
        console.error('Erro ao se registar:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao tentar registar.' });
    }
};

exports.login = async (req, res) => {
    const { password, email } = req.body;

    if (!password || !email) {
        return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    try {
        const student = await prisma.student.findUnique({
            where: { email: email },
        });

        if (!student) {
            return res.status(401).json({ error: "Email não encontrado" });
        }

        const isPasswordValid = await bcrypt.compare(password, student.password);

        if (isPasswordValid) {
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

            res.status(200).json({
                message: "Login bem-sucedido! Bem-vindo(a).",
                token: token,
                student: {
                    id: student.id,
                    username: student.studentName,
                    email: student.email,
                },
            });
        } else {
            return res.status(401).json({ error: "Senha incorreta" });
        }
    } catch (error) {
        console.error('Erro no processo de login:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao tentar fazer login.' });
    }
};

// NOVA FUNÇÃO ADICIONADA:
exports.obterPerfil = async (req, res) => {
    try {
        const studentId = req.student.studentId; 

        const student = await prisma.student.findUnique({
            where: { id: studentId },
            select: {
                studentName: true,
                email: true
            }
        });

        if (!student) {
            return res.status(404).json({ error: "Estudante não encontrado." });
        }

        res.status(200).json({
            name: student.studentName,
            email: student.email
        });
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        res.status(500).json({ error: 'Erro interno ao carregar perfil.' });
    }
};