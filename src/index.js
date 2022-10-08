const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origins: "https://63419693434e17536c4657f9--startling-croquembouche-2f8126.netlify.app/",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('join_room', (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    })

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    })
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
})

server.listen(3001, () => {
    console.log("SERVER RUNNING");
});
