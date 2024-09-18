import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { messageModel } from "./src/features/message/message.schema.js";
import { getMessageHistory } from "./src/features/message/message.repository.js";
import {
  onboardUser,
  deleteUser,
  otherOnlineUsers,
} from "./src/features/user/user.repository.js";
import path from "path";
import siofu from "socketio-file-upload";
import { ChildProcess } from "child_process";

const onlineUsers = [];

export const app = express();
app.use(cors());
app.use(siofu.router);

const __dirname = path.resolve();
console.log(__dirname);
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.redirect("/index.html");
});

export const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Connection made.");

  const uploader = new siofu();
  uploader.listen(socket);

  uploader.dir = "./public/uploads/";

  uploader.on("start", async function (event) {
    console.log("Started");
    console.log(event.file.name);
    console.log(event.file.pathName);
  });

  uploader.on("saved", async function (event) {
    console.log("Saved");
    console.log(event.file.base);
    console.log(event.file.pathName);
    const name = event.file.meta.userName;
    const fileName = event.file.base + "." + event.file.name.split(".")[1];
    const user = await onboardUser({ name, fileName });
    onlineUsers.push(user.res);
    socket.user = user.res;
    console.log(socket.user);
    socket.emit("welcome", socket.user);
    socket.broadcast.emit("newUser", socket.user);
    // const users = await otherOnlineUsers(socket.user._id);
    const users = onlineUsers.filter((user) => {
      return !user._id.equals(socket.user._id);
    });
    socket.emit("onlineUsers", users);
    const previousMessages = await getMessageHistory();
    socket.emit("previousMessages", previousMessages);
  });

  // Error handler:
  uploader.on("error", function (event) {
    console.log("Error from uploader", event);
  });

  socket.on("sendMessage", async (data) => {
    console.log("Message received");
    console.log(data);
    const message = new messageModel(data);
    await message.save();
    const populatedMessage = await message.populate("userId");
    // Broadcast the received message to all users in the same room
    socket.emit("message", populatedMessage);
    socket.broadcast.emit("message", populatedMessage);
  });

  socket.on("typing", (data) => {
    // Broadcast the received message to all users in the same room
    console.log("Typing: ");
    console.log(data);
    socket.broadcast.emit("userTyping", data);
  });

  socket.on("typingStopped", () => {
    // Broadcast the received message to all users in the same room
    console.log("Typing stopped");
    socket.broadcast.emit("typingStopped");
  });

  socket.on("disconnect", async () => {
    // if (socket.user) {
    //   const deletedUser = await deleteUser(socket.user._id);
    //   console.log(deletedUser);
    // }
    socket.broadcast.emit("userLeft", socket.user);
    console.log("Connection disconnected.");
  });
});
