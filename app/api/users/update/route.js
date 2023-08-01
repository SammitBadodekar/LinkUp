import { NextResponse } from "next/server";
import { connect } from "@/utils/db";
import User from "@/models/UserModel";

export const PUT = async (req) => {
  const body = await req.json();
  await connect();
  try {
    const user = { email: body.email };
    const nameUpdate = {
      $set: {
        name: body.name,
      },
    };
    const bioUpdate = {
      $set: {
        bio: body.bio,
      },
    };
    const imgUpdate = {
      $set: {
        image: body.image,
      },
    };
    await User.updateOne(user, nameUpdate);
    await User.updateOne(user, bioUpdate);
    await User.updateOne(user, imgUpdate);
    return new NextResponse("updated");
  } catch (error) {
    return new NextResponse(error);
  }
};
