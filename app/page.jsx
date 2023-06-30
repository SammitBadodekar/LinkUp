"use client";
import Chatlist from "@/components/chatlist";
import Navbar from "@/components/Navbar";
import Chat from "@/components/chat";
import Requests from "@/components/requests";
import { UserContext } from "@/context/userContext";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io.connect("https://linkup-backend.vercel.app");

export default function Home() {
  const [section, setSection] = useState("chat");
  const [user, setUser] = useContext(UserContext);
  const [active, setActive] = useState(null);
  const session = useSession();
  useEffect(() => {
    socket.on("broadcast", (data) => {
      alert(data.message);
    });
  }, [socket]);
  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await fetch(`/api/users/${session.data.user.email}`);
      const result = await userInfo.json();
      setUser(result[0]);
    };
    if (session.data?.user) {
      fetchUserInfo();
    }
  }, [session.data?.user]);

  if (session.status === "unauthenticated") {
    redirect("/login");
  }
  return (
    <main>
      <div className=" sm:w-1/3">
        <Navbar user={user} />
      </div>

      <div></div>
      <div className="flex">
        <button
          onClick={() => {
            setSection("chat");
            socket.emit("send_message", { message: "hello mf" });
          }}
          className={`btn-navigation p-2 text-black dark:text-slate-200 ${
            section === "chat" ? " border-b-2 border-white" : ""
          }`}
        >
          Chats
        </button>
        <button
          onClick={() => setSection("request")}
          className={`btn-navigation p-2 text-black dark:text-slate-200 ${
            section === "request" ? " border-b-2 border-white" : ""
          }`}
        >
          Requests &#40;{user?.requests.length || "0"}&#41;
        </button>
      </div>
      <div
        className={`${
          section === "chat"
            ? "sm:chatList-container w-screen sm:static sm:w-1/3"
            : "hidden"
        } `}
      >
        <Chatlist
          friends={user?.friends}
          active={active}
          setActive={setActive}
        />
      </div>
      <div
        className={`${
          section === "request" ? "request overflow-y-scroll" : "hidden"
        }`}
      >
        <Requests user={user} />
      </div>
      <div
        className={`chat  fixed bottom-0 left-0 top-0 flex flex-col gap-2 overflow-y-scroll text-center dark:bg-darkTheme  dark:text-white sm:left-1/3 sm:w-2/3 ${
          active !== null ? "open" : ""
        }`}
      >
        <Chat active={active} setActive={setActive} />
      </div>
    </main>
  );
}
