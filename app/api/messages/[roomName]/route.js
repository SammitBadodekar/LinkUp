import { NextResponse } from "next/server";
import { connect } from "@/utils/db";
import Message from "@/models/MessageModel";

export const GET = async (req, { params }) => {
  const { roomName } = params;
  try {
    await connect();
    const messages = await Message.findOne({ roomName: roomName });
    return new NextResponse(JSON.stringify(messages));
  } catch (error) {
    console.log(error);
    return new NextResponse(error);
  }
};
