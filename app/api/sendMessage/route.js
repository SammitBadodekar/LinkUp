import { NextResponse } from "next/server";
import { connect } from "@/utils/db";
import Message from "@/models/MessageModel";

export const PUT = async (req) => {
  const body = await req.json();
  const message = body.message;
  try {
    await connect();
    const allMessages = await Message.findOne(
      { roomName: body.roomName },
      { messages: 1 }
    );
    if (message.sender === "linkup-info") {
      await Message.updateOne(
        { roomName: body.roomName },
        {
          $set: {
            messages: [message],
          },
        }
      );
    } else {
      const newMessages = {
        $set: {
          messages: [message, ...allMessages.messages],
        },
      };
      await Message.updateOne({ roomName: body.roomName }, newMessages);
    }

    return new NextResponse("sent");
  } catch (error) {
    console.log(error);
    return new NextResponse(error);
  }
};
