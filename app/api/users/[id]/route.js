import { NextResponse } from "next/server";
import { connect } from "@/utils/db";
import User from "@/models/UserModel";

export const GET = async (req, { params }) => {
  const { id } = params;
  try {
    await connect();
    const user = await User.find({ email: id });
    return new NextResponse(JSON.stringify(user));
  } catch (error) {
    return new NextResponse(error);
  }
};
