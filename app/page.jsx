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
import NewChats from "@/components/newChats";
import Image from "next/image";

const backendURL =
  "https://linkup-backend-2uhh.onrender.com"; /* ("http://localhost:3001"); */

const socket = io.connect(backendURL);

const Chatlist = dynamic(() => import("@/components/chatlist"), {
  loading: () => (
    <div className="flex h-screen w-screen flex-col items-center gap-2 p-4">
      <div className="h-20 w-full animate-bounce items-center gap-2">
        <div className=" mx-2 h-10 w-full rounded-3xl bg-slate-200 dark:bg-DarkButNotBlack"></div>
      </div>
      <div className=" h-20 w-full animate-bounce items-center gap-2">
        <div className=" mx-2 h-10 w-full rounded-3xl bg-slate-200 dark:bg-DarkButNotBlack"></div>
      </div>
      <div className="h-20 w-full animate-bounce items-center gap-2">
        <div className=" mx-2 h-10 w-full rounded-3xl bg-slate-200 dark:bg-DarkButNotBlack"></div>
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

export default function Home() {
  const { data: session, status, update } = useSession();
  const [section, setSection] = useState("chat");
  const [addNewChats, setAddNewChats] = useState(false);
  const [isClickedProfile, setIsClickedProfile] = useState(false);
  const {
    user,
    setUser,
    requests,
    setRequests,
    setFriends,
    active,
    setActive,
  } = useContext(UserContext);
  const [initialLoadingPhrase, setInitialLoadingPhrase] = useState([
    "setting up your account...",
    "loading your profile...",
    "finishing your setup...",
  ]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      socket.emit("join_self", { email: session.user?.email });
      const userInfo = await fetch(`/api/users/${session.user?.email}`);
      const result = await userInfo.json();
      setUser(result[0]);
      setRequests(result[0].requests);
      setFriends(result[0].friends);
      localStorage.setItem("friends", JSON.stringify(result[0].friends));
    };
    if (session?.user) {
      fetchUserInfo();
    }
  }, [session?.user]);

  useEffect(() => {
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };
    window.addEventListener("popstate", () => {
      setAddNewChats(false);
      setSection("chat");
      setIsClickedProfile(false);
      setActive(null);
    });
  });

  useEffect(() => {
    socket.on("receive_request", (data) => {
      console.log(data);
      setRequests((prev) => [data, ...prev]);
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } pointer-events-auto flex w-full max-w-md rounded-lg bg-slate-300 shadow-lg ring-1 ring-black ring-opacity-5`}
        >
          <div
            className="w-0 flex-1 p-4"
            onClick={() => {
              setSection("request");
              toast.dismiss(t.id);
            }}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <Image
                  src={data.sender?.image}
                  alt="/PngItem_307416.png"
                  width={50}
                  height={50}
                  className=" rounded-full"
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {data.sender?.name}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  sent a friend request
                </p>
              </div>
            </div>
          </div>
        </div>
      ));
    });
  }, [socket]);

  if (status === "unauthenticated") {
    redirect("/login");
  }
  if (!user) {
    setInterval(() => {
      setInitialLoadingPhrase((prev) => [prev[1], prev[2], prev[0]]);
    }, 1500);
    console.log("from loading phrase");
  }
  console.log("from home");

  return (
    <main>
      <div className=" overflow-hidden shadow-lg sm:w-1/3">
        <Navbar
          user={session?.user}
          isClicked={isClickedProfile}
          setIsClicked={setIsClickedProfile}
        />
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

      <div
        className={` duration-300 ease-in ${
          section === "chat"
            ? " sm:chatList-container w-screen translate-x-0 sm:static sm:w-1/3"
            : " -translate-x-full opacity-0"
        } `}
      >
        <Chatlist
          socket={socket}
          backendURL={backendURL}
          addNewChats={addNewChats}
          setAddNewChats={setAddNewChats}
        />
      </div>

      <Requests section={section} />
      <div
        className={`chat fixed bottom-0 left-0 top-0 flex flex-col gap-2 overflow-y-hidden text-center dark:bg-darkTheme  dark:text-white sm:left-1/3 sm:w-4/6 ${
          active !== null ? "open" : "close"
        }`}
      >
        <Chat socket={socket} user={session?.user} />
      </div>
      <NewChats
        addNewChats={addNewChats}
        setAddNewChats={setAddNewChats}
        socket={socket}
        user={session?.user}
      />

      <div
        className={` absolute bottom-0 left-0 right-0 top-0 flex h-screen flex-col items-center justify-center gap-4 bg-slate-200 p-10 duration-700 ease-out dark:bg-darkTheme ${
          !session?.user ? "z-50 opacity-100 " : " -z-50 opacity-0"
        }`}
      >
        <p>{initialLoadingPhrase[0]}</p>
        <span className="initialLoader "></span>
      </div>
    </main>
  );
}
