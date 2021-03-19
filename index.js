/*
This is my socket.io chat implementation
*/

const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});

io.on("connection", (socket) => {
  console.log("someone connected");
  io.emit("user joined");
  socket.on("disconnect", () => {
    console.log("someone disconnected");
    io.emit("user left");
  });
  socket.on("chat message", (data) => {
    if (data.chatmsg.startsWith("/")) {
      cmd = data.chatmsg;
      cmd = cmd.substring(1);
      processCommand(cmd, socket);
    } else {
      msg = data.username + ": " + data.chatmsg;
      io.emit("chat message", msg);
    }
  });
});

function processCommand(command, socket) {
  switch (command) {
    case "help":
      socket.emit("chat message", "No commands yet")
      break;
    case "me":
      socket.emit("chat message", "In development");
      break;
  }
}

app.use("/client", express.static(__dirname + "/client"));

httpServer.listen(3000, () => {
  console.log("Server started on port 3000");
});