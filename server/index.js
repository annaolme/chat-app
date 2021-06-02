const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] }
});

const users = new Map();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join', (data) => {
        users.set(socket.id, { username: data.username, room: data.room });
        socket.join(data.room);
        socket.to(data.room).emit('message', {
            username: 'System',
            text: data.username + ' joined the room',
            timestamp: new Date().toISOString()
        });
        io.to(data.room).emit('roomUsers', {
            users: Array.from(users.values()).filter(u => u.room === data.room)
        });
    });

    socket.on('chatMessage', (msg) => {
        const user = users.get(socket.id);
        if (user) {
            io.to(user.room).emit('message', {
                username: user.username,
                text: msg,
                timestamp: new Date().toISOString()
            });
        }
    });

    socket.on('typing', () => {
        const user = users.get(socket.id);
        if (user) {
            socket.to(user.room).emit('typing', { username: user.username });
        }
    });

    socket.on('disconnect', () => {
        const user = users.get(socket.id);
        if (user) {
            io.to(user.room).emit('message', {
                username: 'System',
                text: user.username + ' left the room',
                timestamp: new Date().toISOString()
            });
            users.delete(socket.id);
            io.to(user.room).emit('roomUsers', {
                users: Array.from(users.values()).filter(u => u.room === user.room)
            });
        }
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log('Server running on port ' + PORT));
