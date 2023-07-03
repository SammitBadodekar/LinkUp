import { NextResponse } from "next/server";
import { connect } from "@/utils/db";
import Message from "@/models/MessageModel";

export const GET = async (req) => {
  try {
    await connect();
    const messages = await Message.find({ roomName: "Chat Lounge" });
    return new NextResponse(JSON.stringify(messages));
  } catch (error) {
    console.log(error);
    return new NextResponse(error);
  }
};
