import mongoose from "mongoose";

const { Schema } = mongoose;

const messageSchema = new Schema({
  roomName: {
    type: String,
    required: true,
  },
  members: {
    type: Array,
    required: true,
  },
  messages: {
    type: Array,
    required: true,
  },
});

const Message =
  mongoose.models.message || mongoose.model("message", messageSchema);

export default Message;
