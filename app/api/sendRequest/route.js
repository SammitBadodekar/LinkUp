import { NextResponse } from "next/server";
import { connect } from "@/utils/db";
import User from "@/models/UserModel";

export const PUT = async (req) => {
  const body = await req.json();
  try {
    await connect();
    const sender = { email: body.sender.email };
    const requestSent = { type: "sent", receiver: body.receiver };
    const senderUpdate = {
      $set: { requests: [requestSent, ...body.sender.requests] },
    };
    await User.updateOne(sender, senderUpdate);
    const receiver = { email: body.receiver.email };
    const updatedSender = await User.find({ email: body.sender.email });
    const requestReceived = { type: "received", sender: updatedSender[0] };
    const receiverUpdate = {
      $set: {
        requests: [requestReceived, ...body.receiver.requests],
      },
    };
    await User.updateOne(receiver, receiverUpdate);

    return new NextResponse(JSON.stringify("request sent"));
  } catch (error) {
    console.log(error);
    return new NextResponse(error);
  }
};
