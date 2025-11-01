const express = require('express');
const app = express();  
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/database');
const userRouter = require('./routes/userRoute');
const messagerouter = require('./routes/messageRoutes');
const {Server} = require('socket.io');

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
app.use('/api/users', userRouter);
app.use('/api/messages', messagerouter);

// Initialize socket.io server
const io = new Server(server, {
    cors: { origin: '*' }
});

// Store online users
const userSocketMap = {};

// Socket.io connection handler
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User connected:", userId);
    
    if(userId) {
        userSocketMap[userId] = socket.id;
    }
    
    // Emit online users to all connected clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log("User disconnected:", userId);
        if(userId) {
            delete userSocketMap[userId];
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

app.get('/', (req, res) => {
    res.send('Hello from the backend server!');
});

// Connect to database and start server
connectDB();

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Export for use in other files
module.exports = { io, userSocketMap };
