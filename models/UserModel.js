import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
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
  bio: {
    type: String,
  },
  friends: {
    type: Array,
    required: true,
  },
  requests: {
    type: Array,
    required: true,
  },
});

const User = mongoose.models.user || mongoose.model("user", userSchema);

export default User;
