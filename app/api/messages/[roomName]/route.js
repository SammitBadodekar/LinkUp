import { NextResponse } from "next/server";
import { connect } from "@/utils/db";
import Message from "@/models/MessageModel";

export const GET = async (req, { params }) => {
  const { roomName } = params;
  try {
    await connect();
    if (roomName !== "Chat Lounge") {
      const chatRoom = roomName.split("-");
      const messages1 = await Message.find({
        roomName: `${chatRoom[0]}-${chatRoom[1]}`,
      });
      const messages2 = await Message.find({
        roomName: `${chatRoom[1]}-${chatRoom[0]}`,
      });
      if (messages1.length === 0) {
        return new NextResponse(JSON.stringify(messages2[0]));
      } else {
        return new NextResponse(JSON.stringify(messages1[0]));
      }
    } else {
      const messages = await Message.findOne({ roomName: roomName });
      return new NextResponse(JSON.stringify(messages));
    }
  } catch (error) {
    console.log(error);
    return new NextResponse(error);
  }
};
