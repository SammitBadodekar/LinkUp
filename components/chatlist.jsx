import { useState, useContext } from "react";
import { UserContext } from "@/context/userContext";
import Image from "next/image";
import { GiSofa } from "react-icons/gi";
import dynamic from "next/dynamic";

const NewChats = dynamic(() => import("./newChats"), {
  loading: () => <div>loading...</div>,
});

const Chatlist = (props) => {
  const { socket, active, setActive } = props;
  const { friends } = useContext(UserContext);
  const [addNewChats, setAddNewChats] = useState(false);
  return (
    <div className="chatList mt-2 overflow-y-scroll">
      <div
        className="flex items-center gap-2 p-4 font-serif visited:bg-DarkButNotBlack dark:text-slate-200 hover:dark:bg-DarkButNotBlack"
        onClick={() => setActive({ name: "Chat Lounge" })}
      >
        <GiSofa /> Chat Lounge
      </div>
      {friends?.map((friend) => {
        return (
          <article
            key={friend.email}
            className={`flex w-full items-center gap-4 p-2 text-black visited:bg-DarkButNotBlack dark:text-white hover:dark:bg-DarkButNotBlack ${
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
      {addNewChats && (
        <NewChats
          addNewChats={addNewChats}
          setAddNewChats={setAddNewChats}
          socket={socket}
        />
      )}
    </div>
  );
};
export default Chatlist;
