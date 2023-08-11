"use client";
import Image from "next/image";
import Link from "next/link";

const Page = async ({ params }) => {
  const { userTag } = params;
  const email = userTag.split("%40");
  return (
    <div className="m-2 flex flex-col gap-2 sm:m-auto sm:items-center sm:justify-center">
      <Image
        src={user[0]?.image || "/PngItem_307416.webp"}
        alt="profile"
        width={150}
        height={150}
        className="aspect-square self-center rounded-full"
      />
      <p className=" text-slate-400">Name</p>
      <p>{user[0]?.name}</p>
      <p className=" text-slate-400">Tag</p>
      <p>@{user[0]?.email.split("@")[0]}</p>
      <p className=" text-slate-400">{user[0]?.bio ? "bio" : ""}</p>
      <p>{user[0]?.bio}</p>

      <p className=" text-lg font-extrabold">
        {user[0].friends.length > 0 ? "Friends" : ""}
      </p>

      <div>
        {user[0].friends.length > 0 ? (
          user[0].friends.map((friend) => {
            return (
              <Link
                href={`/profile/${friend?.email}`}
                className="m-2 flex items-center gap-2 rounded-lg bg-DarkButNotBlack p-2 px-4"
              >
                <Image
                  src={friend?.image || "/PngItem_307416.webp"}
                  alt=""
                  width={50}
                  height={50}
                  className="aspect-square rounded-full"
                />
                <p>@{friend?.email.split("@")[0]}</p>
              </Link>
            );
          })
        ) : (
          <p>No friends</p>
        )}
      </div>
    </div>
  );
};
export default Page;
