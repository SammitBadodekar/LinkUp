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
    const updatedReceiver = await User.find({ email: body.receiver.email });
    const requestReceived = { type: "received", sender: body.sender };
    const receiverUpdate = {
      $set: {
        requests: [requestReceived, ...updatedReceiver[0].requests],
      },
    };
    await User.updateOne(receiver, receiverUpdate);

    return new NextResponse(JSON.stringify("request sent"));
  } catch (error) {
    console.log(error);
    return new NextResponse(error);
  }
};
