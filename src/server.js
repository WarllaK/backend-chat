require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { PrismaClient } = require('@prisma/client');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:5173",
}));
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
            console.log('📩 Mensagem recebida do cliente:', message.toString());
            
            const data = JSON.parse(message);

            if (data.type === 'auth') {
                ws.userId = data.userId;
                return;
            }

            const { content, userId, reciverId } = data;

            if (content && userId && reciverId) {
                const newMessage = await prisma.message.create({
                    data: {
                        content,
                        author: {
                            connect: { id: userId }
                        },
                        reciver: {
                            connect: { id: reciverId }
                        }
                    },
                    include: {
                        author: true,
                        reciver: true
                    },
                });
                console.log(newMessage)
                //Nesta parte deve enviar a mensagem para um cliente específico
                wss.clients.forEach(client => {
                    if (
                        client.readyState === WebSocket.OPEN
                        &&
                        client.userId === reciverId
                    ) {
                        client.send(JSON.stringify(newMessage));
                    }
                });

                wss.clients.forEach(client => {
                    if (
                        client.readyState === WebSocket.OPEN
                        &&
                        client.userId === userId
                    ) {
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