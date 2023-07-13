import { NextResponse } from "next/server";
import { connect } from "@/utils/db";
import User from "@/models/UserModel";

export const PUT = async (req) => {
  const body = await req.json();
  try {
    await connect();
    const filter = { email: body.user.email };
    const senderFilter = { email: body.sender.email };
    const receiverUpdate = {
      $set: {
        requests: body.updatedRequests,
      },
    };
    const sender = await User.find(senderFilter);
    const updatedSenderInbox = {
      $set: {
        requests: sender[0].requests.filter((req) =>
          req.receiver
            ? req.receiver.email
            : req.sender.email !== body.user.email
        ),
      },
    };
    await User.updateOne(filter, receiverUpdate);
    await User.updateOne(senderFilter, updatedSenderInbox);

    return new NextResponse(JSON.stringify("request removed"));
  } catch (error) {
    console.log(error);
    return new NextResponse(error);
  }
};
