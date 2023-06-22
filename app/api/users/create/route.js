import { NextResponse } from "next/server";
import { connect } from "@/utils/db";
import User from "@/models/UserModel";

export const PUT = async (req) => {
  const user = await req.json();
  await connect();
  const exsistingUser = await User.find({ email: user.email });

  if (user && exsistingUser.length === 0) {
    const createUser = new User({
      name: user.name,
      email: user.email,
      image: user.image,
      friends: ["sam", "shree", "sim"],
    });
    await createUser.save();
    return new NextResponse("created");
  } else {
    return new NextResponse(user);
  }
};
