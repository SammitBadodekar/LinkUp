import { useState, useContext, useRef, useEffect, useCallback } from "react";
import { UserContext } from "@/context/userContext";
import Image from "next/image";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosPeople } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import Loading from "./loading";

const Chatlist = (props) => {
  const { setAddNewChats } = props;
  const { friends, user, active, setActive } =
    useContext(UserContext);

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
              onClick={() => setActiveFriend(friend)}
            >
              <div className="flex items-center gap-4 ">
                <Image
                  src={friend.image}
                  alt=""
                  width={50}
                  height={50}
                  className=" rounded-full"
                ></Image>
                <p className=" py-2">{friend.name}</p>
              </div>
            </article>
          );
        })}
        <div
          className=" m-2 rounded-xl bg-slate-400 p-2 text-center text-xl font-medium text-darkTheme"
          onClick={() => setAddNewChats(true)}
        >
          Add Friends
        </div>
      </div>
      <div>{!friends ? <Loading /> : ""}</div>
    </div>
  );
};
export default Chatlist;
