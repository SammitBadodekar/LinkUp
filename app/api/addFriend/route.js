import { connect } from "@/utils/db";
import User from "@/models/UserModel";
import { NextResponse } from "next/server";

export const PUT = async (req) => {
  const body = await req.json();
  try {
    await connect();
    const ReceiverFilter = { email: body.user.email };
    const SenderFilter = { email: body.sender.email };
    const UpdatedFriends = {
      $set: {
        friends: body.updatedFriends,
      },
    };
    const UpdatedRequests = {
      $set: {
        requests: body.updatedRequests,
      },
    };
    const sender = await User.find(SenderFilter);
    const updatedSenderInbox = {
      $set: {
        requests: sender[0].requests.filter(
          (req) => req?.receiver?.email !== body.user.email
        ),
      },
    };
    const UpdatedSenderFriends = {
      $set: {
        friends: [body.user, ...sender[0].friends],
      },
    };
    await User.updateOne(ReceiverFilter, UpdatedFriends);
    await User.updateOne(SenderFilter, UpdatedSenderFriends);
    await User.updateOne(ReceiverFilter, UpdatedRequests);
    await User.updateOne(SenderFilter, updatedSenderInbox);

    return new NextResponse(JSON.stringify("added friend"));
  } catch (error) {
    console.log(error);
    return new NextResponse(error);
  }
};
