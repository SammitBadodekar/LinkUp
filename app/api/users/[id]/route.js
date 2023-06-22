import { NextResponse } from "next/server";
import { connect } from "@/utils/db";
import User from "@/models/UserModel";

export const GET = async (req, { params }) => {
  const { id } = params;
  try {
    await connect();
    const users = await User.find({ _id: id });
    return new NextResponse(users);
  } catch (error) {
    return new NextResponse(error);
  }
};
