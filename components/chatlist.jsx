import { useState, useContext, useRef, useEffect, useCallback } from "react";
import { UserContext } from "@/context/userContext";
import Image from "next/image";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosPeople } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";

const Chatlist = (props) => {
  const { setAddNewChats } = props;
  const { friends, user, setFriends, active, setActive } =
    useContext(UserContext);
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

  const setActiveFriend = useCallback((friend) => {
    setActive(friend);
  }, []);

  return (
    <div>
      <div className="chatList mt-2 overflow-y-scroll">
        <p className=" p-2 text-xl font-extrabold">Chat Rooms</p>
        <div
          className={`m-2 flex items-center  gap-4 rounded-xl bg-slate-200  px-4 py-2 hover:bg-blue-500 dark:bg-DarkButNotBlack  dark:text-slate-50  dark:hover:bg-blue-500 ${
            active?.name === "Chat Lounge" ? "bg-blue-500" : ""
          }`}
          onClick={() => {
            if (active?.name !== "Chat Lounge")
              setActive({ name: "Chat Lounge", email: "Chat Lounge" });
          }}
        >
          <span className=" rounded-full bg-slate-300 p-2 text-2xl text-darkTheme">
            <IoIosPeople />
          </span>{" "}
          Public Chat Lounge
        </div>
        <p className=" p-2 text-xl font-extrabold">Friends</p>
        {friends?.map((friend) => {
          return (
            <article
              key={friend?.email}
              className={` relative m-2 flex items-center justify-between rounded-xl bg-slate-200 px-4  py-2 hover:bg-blue-500  dark:bg-DarkButNotBlack dark:text-white dark:hover:bg-blue-500 ${
                active === friend ? " bg-blue-500" : ""
              }`}
              onClick={() => setCurrent(friend)}
            >
              <div
                className="flex items-center gap-4 "
                onClick={() => {
                  setActiveFriend(friend);
                }}
              >
                <Image
                  src={friend.image}
                  alt=""
                  width={50}
                  height={50}
                  className=" rounded-full"
                ></Image>
                <p className=" py-2">{friend.name}</p>
              </div>
              <div
                className=""
                ref={modalRef}
                onClick={() => setRemoveFriendBTN((prev) => !prev)}
              >
                <BsThreeDotsVertical />
                {removeFriendBTN && current === friend && (
                  <div className=" absolute -bottom-6 right-2 z-30  rounded-lg bg-slate-100 p-2 dark:bg-gray-600">
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
          className=" m-2 rounded-xl bg-slate-400 p-2 text-center text-xl font-medium text-darkTheme"
          onClick={() => setAddNewChats(true)}
        >
          Add Friends
        </div>
      </div>
    </div>
  );
};
export default Chatlist;
