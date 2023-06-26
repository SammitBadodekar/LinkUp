import NewChats from "./newChats";
import { useState } from "react";
import ProfileLoading from "./profileLoading";

const Chatlist = (props) => {
  const { friends, active, setActive } = props;
  const [addNewChats, setAddNewChats] = useState(false);
  if (friends === undefined)
    return (
      <div>
        <ProfileLoading />
        <ProfileLoading />
        <ProfileLoading />
      </div>
    );
  return (
    <div className="chatList overflow-y-scroll">
      {friends?.map((friend) => {
        return (
          <article
            key={friend}
            className={`w-full max-w-xs p-2 text-black dark:text-white hover:dark:bg-DarkButNotBlack  ${
              active === friend ? " bg-slate-200 dark:bg-DarkButNotBlack" : ""
            }`}
            onClick={() => setActive(`${friend}`)}
          >
            {friend}
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
