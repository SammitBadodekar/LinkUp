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
    const users = await User.findOne({ _id: "64ad009445613725d39e7d73" });
    const allUsers = users.friends;
    await User.updateOne(
      { _id: "64ad009445613725d39e7d73" },
      {
        $set: {
          friends: [
            ...allUsers,
            {
              name: user.name,
              email: user.email,
              image: user.image,
              friends: [],
              requests: [],
            },
          ],
        },
      }
    );
    return new NextResponse("created");
  } else {
    return new NextResponse(user);
  }
};
