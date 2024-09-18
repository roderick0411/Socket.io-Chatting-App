import { self } from "./script.js";

export const renderMessage = (data) => {
  const messageBox = document.createElement("div");
  messageBox.classList.add("message-div");
  if (data.userId && self._id === data.userId._id) {
    messageBox.classList.add("self");
  }
  const userPictureContainer = document.createElement("div");
  userPictureContainer.classList.add("picture-container");
  const userPicture = document.createElement("img");
  if (data.userId) {
    const imageUrl = "/uploads/" + data.userId.fileName;
    userPicture.setAttribute("src", imageUrl);
  } else {
    const imageUrl = "/uploads/default-avatar.png";
    userPicture.setAttribute("src", imageUrl);
  }
  userPicture.classList.add("picture");
  userPictureContainer.appendChild(userPicture);
  messageBox.appendChild(userPictureContainer);
  const messageTextContainer = document.createElement("div");
  messageTextContainer.classList.add("message-text-container");
  const messageTime = document.createElement("div");
  messageTime.classList.add("message-time");
  const time = new Date(data.timestamp);
  const today = new Date().toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const messageDay = time.toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  if (today === messageDay) {
    messageTime.textContent = time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
  } else {
    messageTime.textContent =
      messageDay +
      ", " +
      time.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" });
  }
  const messageHeader = document.createElement("div");
  messageHeader.classList.add("message-header");
  const userName = document.createElement("div");
  userName.classList.add("user-name");
  userName.textContent = data.name;
  const messageText = document.createElement("div");
  messageText.textContent = data.text;
  messageText.classList.add("message-text");
  messageHeader.appendChild(userName);
  messageHeader.appendChild(messageTime);
  messageTextContainer.appendChild(messageHeader);
  messageTextContainer.appendChild(messageText);
  messageBox.appendChild(messageTextContainer);
  document.querySelector("#messages-section").appendChild(messageBox);
};

export const renderUserLeft = (data) => {
  const userLeft = document.createElement("div");
  userLeft.classList.add("user-left");
  userLeft.textContent = `${data.name} left`;
  document.querySelector("#messages-section").appendChild(userLeft);
};

export const renderUserJoined = (data) => {
  const userJoined = document.createElement("div");
  userJoined.classList.add("user-joined");
  userJoined.textContent = `${data.name} joined`;
  document.querySelector("#messages-section").appendChild(userJoined);
};
