const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

app.use((req, res, next) => {
    let allowedOrigin = ["http://localhost:3000", "https://master--startling-croquembouche-2f8126.netlify.app"]
    if (allowedOrigin.indexOf(req.headers.origin) != -1) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.setHeader("Access-Control-Allow-Credentials", true);
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Set-Cookie");
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    }

    console.log(allowedOrigin.indexOf(req.headers.origin));

    next();
})

const io = new Server(server);

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

server.listen(4000, () => {
    console.log("SERVER RUNNING in PORT 4000");
});
