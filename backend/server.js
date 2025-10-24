require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const authRoutes = require("./routes/auth.route.js");
const voteRoutes = require("./routes/vote.route.js");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://real-time-voting-app-beta.vercel.app"
    ],
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/vote", voteRoutes);

// Make io available to routes
app.set('io', io);

mongoose.connect(process.env.DB_CONNECT)
        .then(() => {
            console.log('Connected to DB');
        })
        .catch(err => {
            console.log('Error connecting to DB:', err);
        });

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
