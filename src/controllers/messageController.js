const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createMessage = async (req, res) => {
    const { content } = req.body;
    const authorId = req.user.id; 

    try {
        const message = await prisma.message.create({
            data: {
                content,
                authorId
            },
            include: {
                author: {
                    select: { id: true, name: true, email: true }
                }
            }
        });
        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao enviar mensagem.' });
    }
};

// Obter todas as mensagens
exports.getMessages = async (req, res) => {
    try {
        const messages = await prisma.message.findMany({
            include: {
                author: {
                    select: { id: true, name: true, email: true }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar mensagens.' });
    }
};