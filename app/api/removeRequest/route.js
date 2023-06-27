import { NextResponse } from "next/server";
import { connect } from "@/utils/db";
import User from "@/models/UserModel";

export const PUT = async (req) => {
  const body = await req.json();
  try {
    await connect();
    const filter = { email: body.user.email };
    const receiverUpdate = {
      $set: {
        requestReceived: body.updatedRequests,
      },
    };
    await User.updateOne(filter, receiverUpdate);

    return new NextResponse(JSON.stringify("request removed"));
  } catch (error) {
    console.log(error);
    return new NextResponse(error);
  }
};
