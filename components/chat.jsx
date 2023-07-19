import { BsLink45Deg } from "react-icons/bs";
import { BiArrowBack } from "react-icons/bi";
import { AiOutlineSend } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";
import scrollToBottom from "./scrollToBottom";
import Image from "next/image";
import Loading from "../components/loading";
import { useState, useEffect, useRef } from "react";
import { IoIosPeople } from "react-icons/io";

const Chat = (props) => {
  const { active, setActive, socket, user } = props;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [previousChat, setPreviousChat] = useState(null);
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    if (previousChat?.name === active?.name || !active) {
      scrollToBottom(chatMessagesRef, 300);
    } else {
      setMessages([]);
      fetch(`/api/messages/${active?.name}`)
        .then((resp) => resp.json())
        .then((data) => {
          if (data) {
            setMessages(Object.values(data?.messages)[0]);
          }
        })
        .then(() => scrollToBottom(chatMessagesRef, 400));
    }
  }, [active]);

  useEffect(() => {
    socket.on("broadcast", (data) => {
      if (active?.name === "Chat Lounge") {
        setMessages((prevMessages) => [...prevMessages, data]);
        scrollToBottom(chatMessagesRef, 200);
      }
    });
    socket.on("receive_message", (data) => {
      console.log(data);
      if (active?.name === data.to) {
        setMessages((prevMessages) => [...prevMessages, data]);
        scrollToBottom(chatMessagesRef, 200);
      }
    });
  }, [socket]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input !== "") {
      /*  fetch("/api/sendMessage", {
        method: "PUT",
        body: JSON.stringify({
          roomName: active.name,
          messages: [...messages, { message: input, sender: user }],
        }),
      }); */
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: input, sender: user },
      ]);
      setInput("");
      socket.emit("send_message", {
        message: input,
        sender: { name: user.name, image: user.image },
        to: active?.email,
      });
      scrollToBottom(chatMessagesRef, 200);
    }
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
          onClick={() => {
            setPreviousChat(active);
            setActive(null);
          }}
          className=" text-lg sm:hidden"
        >
          <BiArrowBack />
        </div>
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

      <div className="chat-messages flex w-screen flex-col  overflow-x-hidden overflow-y-scroll bg-white text-left dark:bg-darkTheme">
        {/*  <div
          className={`${
            messages?.length == 0
              ? "mt-10 flex h-screen justify-center"
              : "hidden"
          } `}
        >
          <Loading />
        </div> */}

        {messages
          ? messages.map((message) => {
              if (message.sender?.email === user?.email) {
                return (
                  <div
                    className="max-w-4/5 m-1 ml-8 mr-2 flex h-fit w-fit items-start justify-center self-end rounded-3xl rounded-tr-sm bg-blue-400 p-2 px-4 dark:bg-green-600"
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
