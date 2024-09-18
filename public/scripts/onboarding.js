import { self } from "./script.js";
// import { Blob } from "buffer";

async function viewSelectedImage() {
  console.log("triggered");
  const imageInput = document.querySelector(".image-input");
  const [file] = imageInput.files;
  console.log(file);
  if (file) {
    const imgUrl = URL.createObjectURL(file);
    self.imageUrl = imgUrl;
    const imgPreview = document.querySelector(".image-upload");
    const filename = file.name;
    const fileSize = file.size;
    const enc = file.encoding;
    console.log({ filename, fileSize, enc });
    imgPreview.style.backgroundImage = `url(${imgUrl})`;
    console.log(imgPreview.style.backgroundImage);
  }
}

function assignMetadata(event) {
  const userName = document.querySelector("#username-input").value;
  event.file.meta.userName = userName;
  const imageInput = document.querySelector(".image-input");
  const [file] = imageInput.files;
  event.file.meta.fileType = file.type;
}

function renderOnlineUser(data) {
  const OnlineUsersContainer = document.querySelector(
    "#online-members .members-list"
  );
  const userDiv = document.createElement("div");
  const userPictureContainer = document.createElement("div");
  userPictureContainer.classList.add("picture-container");
  const userPicture = document.createElement("img");
  const imageUrl = "/uploads/" + data.fileName;
  userPicture.setAttribute("src", imageUrl);
  userPicture.classList.add("picture");
  userPictureContainer.appendChild(userPicture);
  const userName = document.createElement("div");
  userName.textContent = data.name;
  userName.classList.add("user-name");
  userDiv.appendChild(userPictureContainer);
  userDiv.appendChild(userName);
  OnlineUsersContainer.appendChild(userDiv);
}

export { viewSelectedImage, assignMetadata, renderOnlineUser };
