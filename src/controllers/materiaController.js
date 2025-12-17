const prisma = require('../config/prisma');

exports.criarMateria = async (req, res) => {
    const { name, image, passGrade, assessments } = req.body;
    const studentId = req.student.studentId;

    if (!name) {
        return res.status(400).json({ error: "O nome da matéria é obrigatório" });
    }

    try {
        const newSubject = await prisma.subject.create({
            data: {
                name: name,
                image: image || "",
                passGrade: parseFloat(passGrade) || 6.0, 
                student: {
                    connect: { id: studentId }
                },
                assessments: {
                    create: assessments.map(av => ({
                        name: av.name,
                        weight: parseFloat(av.weight),
                        grade: parseFloat(av.grade) || 0
                    }))
                }
            },
            include: {
                assessments: true
            }
        });

        res.status(201).json({
            message: "Matéria criada com sucesso!",
            subject: newSubject
        });
    } catch (error) {
        console.error("Erro ao criar matéria:", error);
        res.status(500).json({ error: "Erro interno ao salvar a matéria." });
    }
};

exports.listarMaterias = async (req, res) => {
    try {
        const studentId = req.student.studentId;
        const subjects = await prisma.subject.findMany({
            where: {
                studentId: studentId
            },
            include: {
                assessments: true
            }
        });
        res.status(200).json(subjects);
    } catch (error) {
        console.error("Erro ao buscar matérias:", error);
        res.status(500).json({ error: "Erro interno ao buscar matérias." });
    }
};

// --- NOVA FUNÇÃO PARA GUARDAR AS NOTAS ---
exports.atualizarNotas = async (req, res) => {
    const { id } = req.params; // ID da matéria vindo da URL
    const { grades } = req.body; // Array de notas [{id: "id_da_nota", grade: 8.5}, ...]
    const studentId = req.student.studentId;

    try {
        // 1. Verificar se a matéria pertence ao aluno antes de permitir a edição
        const subject = await prisma.subject.findUnique({
            where: { id: id }
        });

        if (!subject || subject.studentId !== studentId) {
            return res.status(403).json({ error: "Você não tem permissão para editar esta matéria." });
        }

        // 2. Criar uma lista de promessas de atualização para o Prisma
        const updates = grades.map(item => 
            prisma.assessment.update({
                where: { id: item.id },
                data: { grade: parseFloat(item.grade) }
            })
        );

        // 3. Executar todas as atualizações simultaneamente
        await Promise.all(updates);

        res.status(200).json({ message: "Notas atualizadas com sucesso!" });
    } catch (error) {
        console.error("Erro ao atualizar notas:", error);
        res.status(500).json({ error: "Erro interno ao salvar as notas." });
    }
};