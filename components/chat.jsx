import { BsChatDots } from "react-icons/bs";
import { IconContext } from "react-icons";
import { BiArrowBack } from "react-icons/bi";
import { AiOutlineSend } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";
import scrollToBottom from "./scrollToBottom";
import Image from "next/image";
import toast from "react-hot-toast";
import { useState, useEffect, useRef } from "react";

const Chat = (props) => {
  const { active, setActive, socket, user } = props;
  const [input, setInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  const chatMessagesRef = useRef(null);

  useEffect(() => {
    setIsChatLoading(true);
    fetch(`/api/messages/${active?.name}`)
      .then((resp) => resp.json())
      .then((data) =>
        data ? setMessages(Object.values(data?.messages)[0]) : ""
      )
      .then(setIsChatLoading(false))
      .then(scrollToBottom(chatMessagesRef, 700));
    setMessages([]);
  }, [active]);

  useEffect(() => {
    socket.on("broadcast", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      scrollToBottom(chatMessagesRef, 200);
    });
  }, [socket]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input !== "" && messages.length !== 0) {
      fetch("/api/sendMessage", {
        method: "PUT",
        body: JSON.stringify({
          roomName: active.name,
          messages: [...messages, { message: input, sender: user }],
        }),
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: input, sender: user },
      ]);
      setInput("");
      socket.emit("send_message", { message: input, sender: user });
      scrollToBottom(chatMessagesRef, 200);
    }
  };
  if (!active || isChatLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 opacity-0 sm:opacity-100">
        <IconContext.Provider
          value={{
            color: "white",
            className: " w-52 h-52 ",
          }}
        >
          <div>
            <BsChatDots />
          </div>
        </IconContext.Provider>
        <p className=" mx-4 dark:text-white ">
          Connect, Chat, and Collaborate in Real Time with{" "}
          <span className=" text-xl font-extrabold">LinkUp!</span>
        </p>
      </div>
    );
  }
  return (
    <div className=" h-full w-full ">
      <div className="sticky top-0 flex items-center gap-2 border-l-2 border-gray-600 p-2 py-2 text-white dark:bg-DarkButNotBlack">
        <div onClick={() => setActive(null)} className=" text-lg sm:hidden">
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
        <p className=" p-2">{active?.name}</p>
      </div>

      <div className="chat-messages flex w-screen  flex-col overflow-x-hidden overflow-y-scroll text-left">
        {messages
          ? messages.map((message) => {
              if (message.sender?.email === user?.email) {
                return (
                  <div
                    className="max-w-4/5 m-1 ml-8 mr-2 flex h-fit w-fit items-start justify-center self-end rounded-3xl rounded-tr-sm bg-green-600 p-2 px-4"
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
                  <div className=" flex flex-col gap-2 rounded-3xl rounded-tl-sm bg-DarkButNotBlack p-2 px-4">
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
        className=" sticky bottom-0 flex h-14 justify-between gap-2 bg-darkTheme p-2"
        onSubmit={(e) => sendMessage(e)}
      >
        <input
          type="text"
          placeholder="Message"
          className=" w-full rounded-3xl bg-slate-600 p-2"
          onChange={(e) => setInput(e.target.value)}
          value={input}
        />
        <button
          type="submit"
          className=" flex w-12 items-center justify-center rounded-3xl bg-DarkButNotBlack text-white"
        >
          <AiOutlineSend />
        </button>
      </form>
    </div>
  );
};
export default Chat;
