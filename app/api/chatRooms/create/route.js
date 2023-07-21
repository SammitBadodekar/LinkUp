import { NextResponse } from "next/server";
import { connect } from "@/utils/db";
import Message from "@/models/MessageModel";

export const PUT = async (req) => {
  await connect();
  const body = await req.json();
  const existingChatRoom1 = await Message.find({
    roomName: `${body.user.email}-${body.friend.email}`,
  });
  const existingChatRoom2 = await Message.find({
    roomName: `${body.friend.email}-${body.user.email}`,
  });

  if (
    body &&
    existingChatRoom1.length === 0 &&
    existingChatRoom2.length === 0
  ) {
    const createChatRoom = new Message({
      roomName: `${body.user.email}-${body.friend.email}`,
      members: [body.user, body.friend],
      messages: [
        {
          message:
            "Embrace meaningful conversations and make lasting connections through Linkup!",
          sender: "linkup-info",
        },
      ],
    });
    await createChatRoom.save();
    return new NextResponse("created");
  } else {
    return new NextResponse("already there");
  }
};
