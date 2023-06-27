import { connect } from "@/utils/db";
import User from "@/models/UserModel";

export const PUT = async (req) => {
  const body = await req.json();
  try {
    await connect();
    const filter = { email: body.user.email };
    const UpdatedFriends = {
      $set: {
        requestReceived: body.updatedFriends,
      },
    };
    await User.updateOne(filter, UpdatedFriends);

    return new NextResponse(JSON.stringify("added friend"));
  } catch (error) {
    console.log(error);
    return new NextResponse(error);
  }
};
