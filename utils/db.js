import mongooes from "mongoose";

export const connect = async () => {
  try {
    await mongooes.connect(process.env.MONGO_URI);
  } catch (error) {
    throw new Error("conection failed");
  }
};
