import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    friends: {
      type: Array,
      required: true,
    },
    requestSent: {
      type: Array,
      required: true,
    },
    requestReceived: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.user || mongoose.model("user", userSchema);

export default User;
