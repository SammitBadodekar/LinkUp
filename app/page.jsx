"use client";
import { UserContext } from "@/context/userContext";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import Loading from "../components/loading";
import { io } from "socket.io-client";
import Navbar from "@/components/Navbar";

const backendURL =
  "https://linkup-backend-2uhh.onrender.com"; /* ("http://localhost:3001"); */

const socket = io.connect(backendURL);

const Chatlist = dynamic(() => import("@/components/chatlist"), {
  loading: () => (
    <div className="flex h-screen w-screen flex-col items-center p-4">
      <div className="flex h-20 w-full animate-pulse items-center gap-2">
        <div className=" aspect-square h-14 w-14 rounded-full bg-slate-200 dark:bg-DarkButNotBlack"></div>
        <div className=" h-5 w-11/12 bg-slate-200 dark:bg-DarkButNotBlack"></div>
      </div>
      <div className="flex h-20 w-full animate-pulse items-center gap-2">
        <div className=" aspect-square h-14 w-14 rounded-full bg-slate-200 dark:bg-DarkButNotBlack"></div>
        <div className=" h-5 w-11/12 bg-slate-200 dark:bg-DarkButNotBlack"></div>
      </div>
      <div className="flex h-20 w-full animate-pulse items-center gap-2">
        <div className=" aspect-square h-14 w-14 rounded-full bg-slate-200 dark:bg-DarkButNotBlack"></div>
        <div className=" h-5 w-11/12 bg-slate-200 dark:bg-DarkButNotBlack"></div>
      </div>
    </div>
  ),
});
const Chat = dynamic(() => import("@/components/chat"), {
  loading: () => <div>loading...</div>,
});
const Requests = dynamic(() => import("@/components/requests"), {
  loading: () => (
    <div className=" mt-20 flex h-screen justify-center ">
      <Loading />
    </div>
  ),
});
const NewChats = dynamic(() => import("@/components/newChats"), {
  loading: () => (
    <div className=" mt-20 flex h-screen justify-center ">
      <Loading />
    </div>
  ),
});

export default function Home() {
  const [section, setSection] = useState("chat");
  const [addNewChats, setAddNewChats] = useState(false);
  const {
    user,
    setUser,
    requests,
    setRequests,
    setFriends,
    friends,
    active,
    setActive,
  } = useContext(UserContext);
  const [initialLoadingPhrase, setInitialLoadingPhrase] = useState([
    "setting up your account...",
    "loading your profile...",
    "finishing your setup...",
  ]);
  const session = useSession();
  useEffect(() => {
    const fetchUserInfo = async () => {
      socket.emit("join_self", { email: session.data.user?.email });
      const userInfo = await fetch(`/api/users/${session.data.user?.email}`);
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
  if (!user) {
    setInterval(() => {
      setInitialLoadingPhrase((prev) => [prev[1], prev[2], prev[0]]);
    }, 1500);
  }

  return (
    <main>
      <div className=" overflow-hidden shadow-lg sm:w-1/3">
        <Navbar />
      </div>
      <div></div>
      <div className="grid w-full grid-cols-2 gap-2 px-2 sm:w-1/3">
        <button
          onClick={() => setSection("chat")}
          className={`btn-navigation my-2 rounded-lg bg-slate-200 p-4 dark:bg-DarkButNotBlack  ${
            section === "chat"
              ? " bg-slate-400 text-darkTheme dark:bg-slate-400"
              : ""
          }`}
        >
          Chats
        </button>
        <button
          onClick={() => setSection("request")}
          className={`btn-navigation my-2 rounded-lg bg-slate-200 p-4   dark:bg-DarkButNotBlack  ${
            section === "request"
              ? "bg-slate-400 text-darkTheme dark:bg-slate-400"
              : ""
          }`}
        >
          Requests &#40;{requests?.length || 0}&#41;
        </button>
      </div>
      {session.data?.user && (
        <div
          className={` duration-300 ease-in ${
            section === "chat"
              ? " sm:chatList-container w-screen translate-x-0 sm:static sm:w-1/3"
              : " -translate-x-full opacity-0"
          } `}
        >
          {friends && (
            <Chatlist
              socket={socket}
              backendURL={backendURL}
              addNewChats={addNewChats}
              setAddNewChats={setAddNewChats}
            />
          )}
        </div>
      )}
      <Requests section={section} />
      <div
        className={`chat fixed bottom-0 left-0 top-0 flex flex-col gap-2 overflow-y-hidden text-center dark:bg-darkTheme  dark:text-white sm:left-1/3 sm:w-4/6 ${
          active !== null ? "open" : "close"
        }`}
      >
        <Chat socket={socket} user={user} />
      </div>
      <NewChats
        addNewChats={addNewChats}
        setAddNewChats={setAddNewChats}
        socket={socket}
        backendURL={backendURL}
      />
      <div
        className={` absolute bottom-0 left-0 right-0 top-0 flex h-screen flex-col items-center justify-center gap-4 bg-slate-200 p-10 duration-700 ease-out dark:bg-darkTheme ${
          !user ? "z-50 opacity-100 " : " -z-50 opacity-0"
        }`}
      >
        <p>{initialLoadingPhrase[0]}</p>
        <span className="initialLoader "></span>
      </div>
    </main>
  );
}
