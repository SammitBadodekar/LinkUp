import { NextResponse } from "next/server";
import { connect } from "@/utils/db";
import User from "@/models/UserModel";

export const GET = async (req) => {
  try {
    await connect();
    const users = await User.findOne({ _id: "64ad009445613725d39e7d73" });
    const allUsers = users.friends;
    return new NextResponse(JSON.stringify(allUsers));
  } catch (error) {
    console.log(error);
    return new NextResponse(error);
  }
};
