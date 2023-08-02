import { NextResponse } from "next/server";
import { connect } from "@/utils/db";
import User from "@/models/UserModel";

export const PUT = async (req) => {
  const body = await req.json();
  await connect();
  try {
    const user = { email: body.email };
    const Update = {
      $set: {
        name: body.name,
        bio: body.bio,
        image: body.image,
        imageKey: body.imageKey,
      },
    };
    await User.updateOne(user, Update);
    return new NextResponse("updated");
  } catch (error) {
    return new NextResponse(error);
  }
};
