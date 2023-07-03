import { NextResponse } from "next/server";
import { connect } from "@/utils/db";
import User from "@/models/UserModel";
import Message from "@/models/MessageModel";

export const GET = async (req) => {
  try {
    await connect();
    const users = await User.find(
      {},
      {
        email: 1,
        name: 1,
        image: 1,
        requests: 1,
        friends: 1,
      }
    );
    const messages = Message.find();
    return new NextResponse(JSON.stringify(users));
  } catch (error) {
    console.log(error);
    return new NextResponse(error);
  }
};
