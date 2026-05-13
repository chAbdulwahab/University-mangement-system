const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: true,
        credentials: true,
        methods: ["GET", "POST"]
    }
});

// Socket.io Logic
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('sendNotification', (data) => {
        io.emit('getNotification', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Attach io to app to use in routes
app.set('socketio', io);

// Middleware
app.use(express.json());
app.use(cors({
    origin: true, // Allow all origins for now
    credentials: true
}));
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/academic', require('./routes/academicRoutes'));
app.use('/api/finance', require('./routes/financeRoutes'));

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the University Management System API' });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
