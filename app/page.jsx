"use client";
import { UserContext } from "@/context/userContext";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState, Fragment } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import Loading from "../components/loading";
import { io } from "socket.io-client";
import Navbar from "@/components/Navbar";
import NewChats from "@/components/newChats";
import Image from "next/image";
import { motion } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";

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
  const [isClickedProfile, setIsClickedProfile] = useState(false);
  const [addNewChats, setAddNewChats] = useState(false);
  const {
    user,
    setUser,
    requests,
    setRequests,
    setFriends,
    active,
    setActive,
    allUsers,
    profileModalText,
    isModalOpen,
    setIsModalOpen,
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

      if (allUsers) {
        const updatedFriends = allUsers?.filter(
          (user) =>
            result[0].friends.filter((friend) => friend.email === user.email)
              .length > 0
        );
        setFriends(updatedFriends?.reverse());
        if (updatedFriends !== undefined) {
          localStorage.setItem("friends", JSON.stringify(updatedFriends));
        }
      }
    };
    if (session?.user) {
      fetchUserInfo();
    }
  }, [session?.user, allUsers]);

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
              setAddNewChats(false);
              setIsClickedProfile(false);
              setActive(null);
              toast.dismiss(t.id);
            }}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <Image
                  src={data.sender?.image}
                  alt="/PngItem_307416.webp"
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
  }

  return (
    <motion.main
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      exit={{ y: "-100%", opacity: 0 }}
      transition={{
        duration: 0.75,
      }}
    >
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
          Requests&#40;{requests?.length || 0}&#41;
        </button>
      </div>

      <div
        className={` duration-300 ease-in ${
          section === "chat"
            ? " sm:chatList-container w-full translate-x-0 sm:static sm:w-1/3"
            : " -translate-x-full opacity-0 sm:w-1/3"
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
        socket={socket}
        addNewChats={addNewChats}
        setAddNewChats={setAddNewChats}
      />

      <div
        className={` absolute bottom-0 left-0 right-0 top-0 flex h-screen flex-col items-center justify-center gap-4 bg-slate-200 p-10 duration-700 ease-out dark:bg-darkTheme ${
          !session?.user ? "z-50 opacity-100 " : " -z-50 opacity-0"
        }`}
      >
        <p>{initialLoadingPhrase[0]}</p>
        <span className="initialLoader "></span>
      </div>
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsModalOpen((prev) => !prev)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="z-50 flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="z-50 w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-200 p-6 text-left align-middle shadow-xl transition-all dark:bg-DarkButNotBlack">
                  <Dialog.Title
                    as="h3"
                    className="text-center text-lg font-extrabold leading-6 text-gray-900 dark:text-slate-300"
                  >
                    Profile
                  </Dialog.Title>
                  <div className=" flex w-full flex-col items-center justify-center p-4">
                    <Image
                      width={150}
                      height={150}
                      src={
                        profileModalText[0]
                          ?.split("_")[0]
                          .includes("https://loremflickr")
                          ? "/PngItem_307416.webp"
                          : profileModalText[0]
                      }
                      alt="profile"
                      className=" aspect-square rounded-full object-cover"
                    ></Image>
                    <p className=" text-darkTheme dark:text-slate-200">
                      {profileModalText[1]}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      @{profileModalText[2]?.split("@")[0]}
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className=" inline-flex w-full justify-center rounded-md border border-transparent bg-blue-300 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        setIsModalOpen((prev) => !prev);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </motion.main>
  );
}
