import mongoose from "mongoose";
import fs from "fs";
import path from "path";

import { userSchema } from "./user.schema.js";

export const UserModel = mongoose.model("User", userSchema);

export const onboardUser = async (userData) => {
  try {
    const newUser = new UserModel(userData);
    await newUser.save();
    return { success: true, res: newUser };
  } catch (error) {
    return { success: false, error: { statusCode: 400, msg: error } };
  }
};

export const deleteUser = async (userId) => {
  const user = await UserModel.findById(userId);
  try {
    const { fileName } = user;
    const imagePath = path.join("public", "uploads", fileName);
    console.log(imagePath);
    fs.unlinkSync(imagePath);
    console.log("File deleted");
  } catch (error) {
    console.log("Error ocurred");
    console.log(error.message);
  }
  const deletedUser = await UserModel.findByIdAndDelete(userId);
  return deletedUser;
};

export const otherOnlineUsers = async (userId) => {
  console.log(userId);
  const users = await UserModel.find({ _id: { $ne: userId } });
  console.log(users);
  return users;
};
