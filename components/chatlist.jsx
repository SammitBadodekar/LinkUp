import { useState, useContext, useRef, useEffect } from "react";
import { UserContext } from "@/context/userContext";
import Image from "next/image";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GiSofa } from "react-icons/gi";
import dynamic from "next/dynamic";
import toast, { Toaster } from "react-hot-toast";

const NewChats = dynamic(() => import("./newChats"), {
  loading: () => <div>loading...</div>,
});

const Chatlist = (props) => {
  const { socket, active, setActive, backendURL } = props;
  const { friends, user, setFriends } = useContext(UserContext);
  const [addNewChats, setAddNewChats] = useState(false);
  const [removeFriendBTN, setRemoveFriendBTN] = useState(false);
  const [current, setCurrent] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setRemoveFriendBTN(false);
      }
    };

    if (removeFriendBTN) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [removeFriendBTN]);

  const removeFriend = async (friend) => {
    const updatedFriends = await friends.filter(
      (userFriends) => userFriends?.email !== friend?.email
    );
    setFriends(updatedFriends);
    fetch("/api/removeFriend", {
      method: "PUT",
      body: JSON.stringify({
        user,
        friend,
      }),
    }).then(toast(`Removed ${friend.name}`));
  };

  return (
    <div className="chatList mt-2 overflow-y-scroll">
      <div
        className={`flex items-center gap-2 p-4 font-serif visited:bg-DarkButNotBlack dark:text-slate-200 hover:dark:bg-DarkButNotBlack ${
          active?.name === "Chat Lounge"
            ? " bg-slate-200 dark:bg-DarkButNotBlack"
            : ""
        }`}
        onClick={() => {
          if (active?.name !== "Chat Lounge")
            setActive({ name: "Chat Lounge" });
        }}
      >
        <GiSofa /> Chat Lounge
      </div>
      {friends?.map((friend) => {
        return (
          <article
            key={friend?.email}
            className={` relative flex w-full items-center justify-between p-2 text-black visited:bg-DarkButNotBlack dark:text-white hover:dark:bg-DarkButNotBlack ${
              active === friend ? " bg-slate-200 dark:bg-DarkButNotBlack" : ""
            }`}
            onClick={() => setCurrent(friend)}
          >
            <div
              className="flex items-center gap-4"
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
            </div>
            <div
              className=" mx-4"
              ref={modalRef}
              onClick={() => setRemoveFriendBTN((prev) => !prev)}
            >
              <BsThreeDotsVertical />
              {removeFriendBTN && current === friend && (
                <div className=" absolute -bottom-6 right-2 z-30  rounded-lg p-2 dark:bg-gray-600">
                  <button onClick={() => removeFriend(friend)}>
                    Remove Friend
                  </button>
                </div>
              )}
            </div>
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
          backendURL={backendURL}
        />
      )}
    </div>
  );
};
export default Chatlist;
