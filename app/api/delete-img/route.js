import { utapi } from "uploadthing/server";
import { NextResponse } from "next/server";

export const PUT = async (req) => {
  const img = await req.json();
  try {
    await utapi.deleteFiles(img);
    return new NextResponse(JSON.stringify("deleted"));
  } catch (error) {
    console.log(error);
    return new NextResponse(error);
  }
};
