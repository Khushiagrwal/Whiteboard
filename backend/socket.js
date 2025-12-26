const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer();
// server.js
const io = require("socket.io")(3000, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("draw", (data) => {
    socket.broadcast.emit("draw", data); // send to others
  });
});
