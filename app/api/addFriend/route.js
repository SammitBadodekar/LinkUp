import { connect } from "@/utils/db";
import User from "@/models/UserModel";
import { NextResponse } from "next/server";

export const PUT = async (req) => {
  const body = await req.json();
  console.log(body);
  try {
    await connect();
    const ReceiverFilter = { email: body.user.email };
    const SenderFilter = { email: body.sender.email };
    const UpdatedFriends = {
      $set: {
        friends: body.updatedFriends,
      },
    };
    /* await User.updateOne(ReceiverFilter, UpdatedFriends); */

    return new NextResponse(JSON.stringify("added friend"));
  } catch (error) {
    console.log(error);
    return new NextResponse(error);
  }
};
