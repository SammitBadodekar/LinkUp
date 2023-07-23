import { connect } from "@/utils/db";
import User from "@/models/UserModel";
import { NextResponse } from "next/server";

export const PUT = async (req) => {
  const body = await req.json();
  try {
    await connect();
    const userFilter = { email: body.user.email };
    const friendFilter = { email: body.friend.email };

    const updatedUserFriends = {
      $set: {
        friends: body.user.friends.filter(
          (friend) => friend.email !== body.friend.email
        ),
      },
    };

    const updatedSenderFriends = {
      $set: {
        friends: body.friend.friends.filter(
          (friend) => friend?.email !== body.user.email
        ),
      },
    };
    await User.updateOne(userFilter, updatedUserFriends);
    await User.updateOne(friendFilter, updatedSenderFriends);

    return new NextResponse(JSON.stringify("added friend"));
  } catch (error) {
    console.log(error);
    return new NextResponse(error);
  }
};
