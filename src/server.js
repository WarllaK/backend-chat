require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { PrismaClient } = require('@prisma/client');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(express.json());

// Rotas
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', messageRoutes);

// Configuração do WebSocket
wss.on('connection', ws => {
    console.log('Cliente WebSocket conectado.');

    ws.on('message', async message => {
        try {
            const data = JSON.parse(message);
            const { content, userId } = data;

            if (content && userId) {
                const newMessage = await prisma.message.create({
                    data: {
                        content,
                        author: {
                            connect: { id: parseInt(userId) }
                        }
                    },
                    include: {
                        author: true
                    }
                });

                // Envia a nova mensagem para todos os clientes conectados
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(newMessage));
                    }
                });
            }
        } catch (error) {
            console.error('Erro ao processar mensagem WebSocket:', error);
            ws.send(JSON.stringify({ error: 'Formato de mensagem inválido.' }));
        }
    });

    ws.on('close', () => {
        console.log('Cliente WebSocket desconectado.');
    });
});

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});