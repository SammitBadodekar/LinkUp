import { NextResponse } from "next/server";
import { connect } from "@/utils/db";
import User from "@/models/UserModel";

export const PUT = async (req) => {
  const users = await req.json();
  try {
    await connect();
    const newRequest = {
      name: users.receiver.name,
      email: users.receiver.name,
      image: users.receiver.image,
    };

    const sender = { email: users.sender.email };
    const senderUpdate = {
      $set: { requestSent: [users.receiver, ...users.sender.requestSent] },
    };
    const receiver = { email: users.receiver.email };
    const receiverUpdate = {
      $set: {
        requestReceived: [users.sender, ...users.receiver.requestReceived],
      },
    };
    await User.updateOne(sender, senderUpdate);
    await User.updateOne(receiver, receiverUpdate);

    return new NextResponse(JSON.stringify("request sent"));
  } catch (error) {
    console.log(error);
    return new NextResponse(error);
  }
};
