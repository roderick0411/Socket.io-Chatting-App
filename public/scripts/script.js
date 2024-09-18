import {
  viewSelectedImage,
  assignMetadata,
  renderOnlineUser,
} from "./onboarding.js";

import {
  renderMessage,
  renderUserLeft,
  renderUserJoined,
} from "./chatSection.js";

console.log("Step1: Onboarding the user");

export const self = {};

let allUsers = [];

const socket = io.connect("http://localhost:3000");
const uploader = new SocketIOFileUpload(socket);
uploader.addEventListener("error", function (data) {
  if (data.code === 1) {
    alert("Don't upload such a big file");
  }
});
uploader.addEventListener("start", assignMetadata);
uploader.resetFileInputs = true;
const imageInput = document.querySelector(".image-input");
const submitBtn = document.querySelector("#start-chatting");
document
  .querySelector("#onboarding-form")
  .addEventListener("submit", (event) => event.preventDefault());
uploader.listenOnSubmit(submitBtn, imageInput);
imageInput.onchange = viewSelectedImage;

socket.on("welcome", (data) => {
  console.log(data);
  self._id = data._id;
  self.name = data.name;
  document.querySelector("#login-container").classList.toggle("hidden");
  document.querySelector("#chat-section").classList.toggle("hidden");
  document.querySelector(
    "#chat-container .welcome-message"
  ).textContent = `Welcome ${data.name}`;
});

const inputField = document.querySelector("#message-form input");
inputField.addEventListener("keyup", () => {
  const { _id, name } = self;
  console.log("I'm typing");
  console.log({ userId: _id, name });
  socket.emit("typing", { userId: _id, name });
});

inputField.addEventListener("blur", () => {
  socket.emit("typingStopped");
});

socket.on("userTyping", (user) => {
  console.log(user);
  const typingField = document.querySelector("#chat-container .typing");
  typingField.textContent = `${user.name} is typing...`;
});

socket.on("typingStopped", () => {
  const typingField = document.querySelector("#chat-container .typing");
  typingField.textContent = "";
});

document.querySelector("#message-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const messageInput = document.querySelector("#message-input");
  const text = messageInput.value;
  const { _id, name } = self;
  socket.emit("sendMessage", { userId: _id, name, text });
  messageInput.value = "";
});

socket.on("onlineUsers", (users) => {
  console.log(users);
  allUsers = users;
  document.querySelector("#online-members .members-list").innerHTML = "";
  allUsers.forEach((user) => renderOnlineUser(user));
});

socket.on("newUser", (data) => {
  console.log(data);
  allUsers.push(data);
  renderUserJoined(data);
  document.querySelector("#online-members .members-list").innerHTML = "";
  allUsers.forEach((user) => renderOnlineUser(user));
});

socket.on("userLeft", (data) => {
  console.log(data);
  allUsers.push(data);
  renderUserLeft(data);
});

socket.on("previousMessages", (messages) => {
  console.log(messages);
  messages.forEach(renderMessage);
});

socket.on("message", (data) => {
  console.log("Message received");
  console.log(data);
  renderMessage(data);
});

export { socket };
