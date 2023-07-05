import { NextResponse } from "next/server";
import { connect } from "@/utils/db";
import Message from "@/models/MessageModel";

export const PUT = async (req) => {
  const body = await req.json();
  try {
    await connect();
    const newMessages = {
      $set: {
        messages: [body.messages],
      },
    };
    await Message.updateOne({ roomName: body.roomName }, newMessages);
    return new NextResponse("sent");
  } catch (error) {
    console.log(error);
    return new NextResponse(error);
  }
};
