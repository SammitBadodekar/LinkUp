import NewChats from "./newChats";
import { useState } from "react";

const Chatlist = (props) => {
  const { friends, active, setActive } = props;
  const [addNewChats, setAddNewChats] = useState(false);
  return (
    <div className="chatList overflow-y-scroll">
      {friends?.map((friend) => {
        return (
          <article
            key={friend}
            className={`w-full p-2 dark:text-white text-black my-1 max-w-xs  ${
              active === friend ? " bg-slate-200 dark:bg-DarkButNotBlack" : ""
            }`}
            onClick={() => setActive(`${friend}`)}
          >
            {friend}
          </article>
        );
      })}{" "}
      <div
        className=" hover:bg-DarkButNotBlack text-slate-300 p-4"
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
