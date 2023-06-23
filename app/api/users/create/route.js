import { NextResponse } from "next/server";
import { connect } from "@/utils/db";
import User from "@/models/UserModel";

export const PUT = async (req) => {
  await connect();
  const exsistingUser = await User.find({ email: user.email });
  try {
    if (req.body && exsistingUser.length === 0) {
      const user = await req?.json();
      const createUser = new User({
        name: user.name,
        email: user.email,
        image: user.image,
        friends: ["sam", "shree", "sim"],
      });
      await createUser.save();
      return new NextResponse("created");
    }
  } catch (error) {
    console.log(error);
    return new NextResponse(error);
  }
};
