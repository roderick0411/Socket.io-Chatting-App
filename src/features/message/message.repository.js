import { messageModel } from "./message.schema.js";

export const getMessageHistory = async () => {
  const messages = await messageModel.find().sort({ timestamp: 1 });
  const populatedMessages = [];
  for (const message of messages) {
    const populated = await message.populate("userId");
    populatedMessages.push(populated);
  }
  console.log(populatedMessages);
  return populatedMessages;
};
