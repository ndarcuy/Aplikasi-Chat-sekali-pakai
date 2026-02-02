const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

/* serve file static dari folder public */
app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join", ({ room, name }) => {
    socket.join(room);
    socket.room = room;
    socket.name = name;

    io.to(room).emit("system", `${name} joined`);
  });

  socket.on("message", (msg) => {
    io.to(socket.room).emit("message", {
      name: socket.name,
      msg,
    });
  });

  socket.on("disconnect", () => {
    if (socket.room && socket.name) {
      io.to(socket.room).emit("system", `${socket.name} left`);
    }
  });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
