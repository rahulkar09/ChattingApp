const express = require('express');
const app = express();  
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/database');
const { Server } = require('socket.io');

// 👉 Export these early to prevent circular require issues
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});
const userSocketMap = {};
module.exports = { io, userSocketMap }; // ✅ Export before requiring routers

// Now safely import routes
const userRouter = require('./routes/userRoute');
const messageRouter = require('./routes/messageRoutes');

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
app.use('/api/users', userRouter);
app.use('/api/messages', messageRouter);

// Socket.io logic
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User connected:", userId);
    
    if (userId) {
        userSocketMap[userId] = socket.id;
    }
    
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log("User disconnected:", userId);
        if (userId) {
            delete userSocketMap[userId];
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

app.get('/', (req, res) => {
    res.send('Hello from the backend server!');
});

connectDB();

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
