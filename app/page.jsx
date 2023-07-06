"use client";
import { UserContext } from "@/context/userContext";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import Loading from "../components/loading";
import { io } from "socket.io-client";
const socket = io.connect("https://linkup-backend-2uhh.onrender.com");
/* ("http://localhost:3001"); */

const Chatlist = dynamic(() => import("@/components/chatlist"), {
  loading: () => (
    <div className=" mt-10 flex h-screen justify-center">
      <Loading />
    </div>
  ),
});
const Chat = dynamic(() => import("@/components/chat"), {
  loading: () => <div>loading...</div>,
});
const Requests = dynamic(() => import("@/components/requests"), {
  loading: () => <div>loading...</div>,
});
const Navbar = dynamic(() => import("@/components/Navbar"), {
  loading: () => (
    <div className="z-50 flex h-14 justify-between bg-DarkButNotBlack p-2 px-4 shadow-lg"></div>
  ),
});

export default function Home() {
  const [section, setSection] = useState("chat");
  const { user, setUser, requests, setRequests, setFriends } =
    useContext(UserContext);
  const [active, setActive] = useState(null);
  const session = useSession();

  useEffect(() => {
    const fetchUserInfo = async () => {
      socket.emit("join_self", { email: session.data.user.email });
      const userInfo = await fetch(`/api/users/${session.data.user.email}`);
      const result = await userInfo.json();
      setUser(result[0]);
      setRequests(result[0].requests);
      setFriends(result[0].friends);
    };
    if (session.data?.user) {
      fetchUserInfo();
    }
  }, [session.data?.user]);

  useEffect(() => {
    socket.on("receive_request", (data) => {
      setRequests((prev) => [data, ...prev]);
      toast(`${data.sender.name} sent you friend request`);
    });
  }, [socket]);

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
          onClick={() => setSection("chat")}
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
          Requests &#40;{requests?.length || 0}&#41;
        </button>
      </div>
      {session.data?.user && (
        <div
          className={`${
            section === "chat"
              ? "sm:chatList-container w-screen sm:static sm:w-1/3"
              : "hidden"
          } `}
        >
          <Chatlist socket={socket} active={active} setActive={setActive} />
        </div>
      )}

      {section === "request" && <Requests />}
      <div
        className={`chat fixed bottom-0 left-0 top-0 flex flex-col gap-2 overflow-y-hidden text-center dark:bg-darkTheme  dark:text-white sm:left-1/3 sm:w-4/6 ${
          active !== null ? "open" : ""
        }`}
      >
        <Chat
          active={active}
          setActive={setActive}
          socket={socket}
          user={user}
        />
      </div>
    </main>
  );
}
