"use client";
import { BsLink45Deg, BsThreeDotsVertical } from "react-icons/bs";
import { BiArrowBack } from "react-icons/bi";
import { AiOutlineSend } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";
import scrollToBottom from "./scrollToBottom";
import Image from "next/image";
import Loading from "../components/loading";
import toast from "react-hot-toast";
import { useState, useEffect, useRef, useContext, Fragment } from "react";
import { IoIosPeople } from "react-icons/io";
import { UserContext } from "@/context/userContext";
import { Dialog, Transition } from "@headlessui/react";

const Chat = (props) => {
  const { socket, user } = props;
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState([]);
  const [input, setInput] = useState("");
  const chatMessagesRef = useRef(null);
  const { active, setActive, friends, setFriends } = useContext(UserContext);
  const activeRef = useRef(active);
  const [removeFriendBTN, setRemoveFriendBTN] = useState(false);
  const modalRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [modalText, setModalText] = useState([]);

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

  useEffect(() => {
    activeRef.current = active;
    if (!active) {
      scrollToBottom(chatMessagesRef, 300);
    } else {
      setMessages([]);
      console.log(`${user?.email}-${active?.email}`);
      fetch(
        `/api/messages/${
          active.name === "Chat Lounge"
            ? active.name
            : `${user?.email}-${active?.email}`
        }`
      )
        .then((resp) => resp.json())
        .then((data) => {
          if (data) {
            setRoomName(data?.roomName);
            setMessages(data?.messages);
          }
        })
        .then(() => scrollToBottom(chatMessagesRef, 400));
    }
  }, [active]);

  const clearMessages = () => {
    const newMessage = {
      message: `${user.name} cleared all chats`,
      sender: "linkup-info",
    };
    fetch("/api/sendMessage", {
      method: "PUT",
      body: JSON.stringify({
        roomName,
        messages: [newMessage],
      }),
    }).then(toast("cleared all messages from both sides"));
    setMessages([newMessage]);
    socket.emit("send_message", {
      message: `${user.name} cleared all previous messages`,
      sender: {
        name: user.name,
        email: user.email,
        image: user.image,
        behalf: "linkup-info",
      },
      to: active?.email,
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const newMessage = input;
    const sender = { name: user.name, image: user.image, email: user.email };
    if (input !== "") {
      fetch("/api/sendMessage", {
        method: "PUT",
        body: JSON.stringify({
          roomName,
          messages: [...messages, { message: newMessage, sender }],
        }),
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: newMessage, sender },
      ]);
      setInput("");
      socket.emit("send_message", {
        message: newMessage,
        sender,
        to: active?.email,
      });
      scrollToBottom(chatMessagesRef, 200);
    }
  };
  useEffect(() => {
    socket.on("broadcast", (data) => {
      if (activeRef.current?.name === "Chat Lounge") {
        setMessages((prevMessages) => [...prevMessages, data]);
        scrollToBottom(chatMessagesRef, 200);
      }
    });
    socket.on("receive_message", (data) => {
      if (activeRef.current?.email === data.sender?.email) {
        if (data.sender?.behalf === "linkup-info") {
          setMessages([data]);
          toast(data.message);
        } else {
          setMessages((prevMessages) => [...prevMessages, data]);
          scrollToBottom(chatMessagesRef, 200);
        }
      }
      if (activeRef.current?.email !== data.sender?.email) {
        if (data.sender?.behalf === "linkup-info") {
          toast(data.message);
        } else
          toast.custom((t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5`}
            >
              <div
                className="w-0 flex-1 p-4"
                onClick={() => {
                  setActive(data.sender);
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
                      {data.message.slice(0, 15)}...
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Close
                </button>
              </div>
            </div>
          ));
      }
    });
  }, [socket]);

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
    setActive(null);
  };

  if (!active) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 border-l-2 border-slate-300 bg-slate-100 opacity-0 dark:border-slate-600  dark:bg-darkTheme sm:opacity-100">
        <div className=" rounded-full bg-slate-300 p-4 text-9xl shadow-xl dark:bg-DarkButNotBlack">
          <BsLink45Deg />
        </div>
        <p className=" mx-4 dark:text-white ">
          Connect, Chat, and Collaborate in Real Time with{" "}
          <span className=" text-xl font-extrabold">LinkUp!</span>
        </p>
      </div>
    );
  }
  return (
    <div className=" h-full w-full border-l-2 border-slate-300 dark:border-slate-600">
      <div className="sticky top-0 flex items-center gap-2 bg-slate-100  p-2 py-2 shadow-lg dark:bg-DarkButNotBlack dark:text-white">
        <div
          className=" text-lg sm:hidden"
          onClick={() => {
            setActive(null);
          }}
        >
          <BiArrowBack />
        </div>
        <div className=" flex gap-2">
          <Image
            src={active?.image || "/PngItem_307416.png"}
            alt=""
            width={50}
            height={50}
            className={`self-start rounded-full ${
              active?.name === "Chat Lounge" ? "hidden" : ""
            }`}
          ></Image>
          <span
            className={`-mr-2 rounded-full bg-slate-300 p-2 text-2xl text-darkTheme ${
              active?.name !== "Chat Lounge" ? "hidden" : ""
            }`}
          >
            <IoIosPeople />
          </span>
          <p className=" p-2">{active?.name}</p>
        </div>
        <div
          className={`ml-auto px-4 ${
            active?.name === "Chat Lounge" ? "hidden" : ""
          }`}
          ref={modalRef}
          onClick={() => setRemoveFriendBTN((prev) => !prev)}
        >
          <BsThreeDotsVertical />
          {removeFriendBTN && (
            <div
              className=" absolute right-2 top-10 z-50 grid w-40 rounded-lg
             bg-slate-100 p-2 dark:bg-gray-600"
            >
              <button
                className=" p-2 text-left"
                onClick={() => {
                  setModalText([
                    "Are you sure you want to clear all chats ?",
                    "All chats from both sides will be deleted. Chats will be permanently deleted",
                    "Delete Chats",
                    "clear chat",
                  ]);
                  setIsOpen((prev) => !prev);
                }}
              >
                Clear Chat
              </button>
              <button
                onClick={() => {
                  setModalText([
                    `Are you sure you want to remove ${active.name} ?`,
                    `${active.name} can still send you message until he refreshes his browser`,
                    `Remove ${active.name}`,
                    "remove friend",
                  ]);
                  setIsOpen((prev) => !prev);
                }}
                className=" p-2 text-left"
              >
                Remove Friend
              </button>
            </div>
          )}
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen((prev) => !prev)}
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

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-300 p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-600">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-extrabold leading-6 text-gray-900 dark:text-slate-300"
                  >
                    {modalText[0]}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      {modalText[1]}
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className=" inline-flex w-full justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        setIsOpen((prev) => !prev);
                        if (modalText[3] === "clear chat") {
                          clearMessages();
                        }
                        if (modalText[3] === "remove friend") {
                          removeFriend(active);
                        }
                      }}
                    >
                      {modalText[2]}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <div className="chat-messages flex w-screen flex-col  overflow-x-hidden overflow-y-scroll bg-white text-left dark:bg-darkTheme">
        <div
          className={`${
            messages?.length == 0
              ? "mt-10 flex h-screen justify-center"
              : "hidden"
          } `}
        >
          <Loading />
        </div>

        {messages
          ? messages.map((message) => {
              if (
                message.sender === "linkup-info" ||
                message.sender?.behalf === "linkup-info"
              ) {
                return (
                  <div
                    className="max-w-4/5 m-2 mx-6 flex h-fit w-fit items-start justify-center self-center rounded-lg bg-slate-400 p-2 text-center text-xs text-white dark:text-darkTheme sm:mx-2"
                    key={uuidv4()}
                  >
                    <p>{message?.message}</p>
                  </div>
                );
              }
              if (message.sender?.email === user?.email) {
                return (
                  <div
                    className="max-w-4/5 m-1 ml-8 mr-2 flex h-fit w-fit items-start justify-center self-end rounded-3xl rounded-tr-sm bg-blue-300 p-2 px-4 dark:bg-green-600"
                    key={uuidv4()}
                  >
                    <p>{message?.message}</p>
                  </div>
                );
              }
              return (
                <div
                  className="m-1 mx-2 flex w-fit items-start justify-center gap-2 "
                  key={uuidv4()}
                >
                  <Image
                    src={message?.sender?.image || "/PngItem_307416.png"}
                    alt=""
                    width={30}
                    height={30}
                    className={`rounded-full`}
                  ></Image>
                  <div className=" flex flex-col gap-2 rounded-3xl rounded-tl-sm bg-slate-200 p-2 px-4 dark:bg-DarkButNotBlack">
                    <p className=" -ml-2 text-xs font-extralight">
                      ~ {message?.sender?.name}
                    </p>
                    <p>{message?.message}</p>
                  </div>
                </div>
              );
            })
          : ""}
        <div ref={chatMessagesRef} />
      </div>
      <form
        className=" sticky bottom-0 flex h-14 justify-between gap-2 bg-white p-2 dark:bg-darkTheme"
        onSubmit={(e) => sendMessage(e)}
      >
        <input
          type="text"
          placeholder="Message"
          className=" w-full rounded-3xl bg-slate-300 p-2 dark:bg-slate-600"
          onChange={(e) => setInput(e.target.value)}
          value={input}
        />
        <button
          type="submit"
          className=" flex w-12 items-center justify-center rounded-3xl bg-slate-300  dark:bg-DarkButNotBlack dark:text-white"
        >
          <AiOutlineSend />
        </button>
      </form>
    </div>
  );
};
export default Chat;
