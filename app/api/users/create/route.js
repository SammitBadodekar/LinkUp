import { NextResponse } from "next/server";
import { connect } from "@/utils/db";
import User from "@/models/UserModel";

export const PUT = async (req) => {
  await connect();
  const user = await req.json();
  const existingUser = await User.find({ email: user.email });
  if (user && existingUser.length === 0) {
    const createUser = new User({
      name: user.name,
      email: user.email,
      image: user.image,
      friends: [],
      requests: [],
    });
    await createUser.save();
    return new NextResponse(JSON.stringify(user));
  } else {
    return new NextResponse(JSON.stringify(existingUser));
  }
};
