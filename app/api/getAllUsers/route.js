import { NextResponse } from "next/server";
import { connect } from "@/utils/db";
import User from "@/models/UserModel";
import Message from "@/models/MessageModel";

export const GET = async (req) => {
  try {
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users));
  } catch (error) {
    console.log(error);
    return new NextResponse(error);
  }
};
