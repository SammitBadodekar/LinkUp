import NewChats from "./newChats";
import { useState } from "react";
import ProfileLoading from "./profileLoading";
import Image from "next/image";

const Chatlist = (props) => {
  const { friends, active, setActive } = props;
  const [addNewChats, setAddNewChats] = useState(false);
  if (friends === undefined)
    return (
      <div className=" flex flex-col gap-4 px-4">
        <ProfileLoading />
        <ProfileLoading />
        <ProfileLoading />
      </div>
    );
  return (
    <div className="chatList mt-2 overflow-y-scroll">
      <div
        className=" p-4 dark:bg-DarkButNotBlack"
        onClick={() => setActive({ name: "Chat Lounge" })}
      >
        Chat Lounge
      </div>
      {friends?.map((friend) => {
        return (
          <article
            key={friend.email}
            className={`flex w-full max-w-xs items-center gap-4 p-2 text-black dark:text-white hover:dark:bg-DarkButNotBlack  ${
              active === friend ? " bg-slate-200 dark:bg-DarkButNotBlack" : ""
            }`}
            onClick={() => setActive(friend)}
          >
            <Image
              src={friend.image}
              alt=""
              width={50}
              height={50}
              className=" rounded-full"
            ></Image>
            {friend.name}
          </article>
        );
      })}{" "}
      <div
        className=" p-4 text-slate-300 hover:bg-DarkButNotBlack"
        onClick={() => setAddNewChats(!addNewChats)}
      >
        + Add New Chats
      </div>
      <div>
        <NewChats addNewChats={addNewChats} setAddNewChats={setAddNewChats} />
      </div>
    </div>
  );
};
export default Chatlist;
