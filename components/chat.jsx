import { BsChatDots } from "react-icons/bs";
import { IconContext } from "react-icons";
import { BiArrowBack } from "react-icons/bi";
import { AiOutlineSend } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { useState, useEffect } from "react";

const Chat = (props) => {
  const { active, setActive, socket, user } = props;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("broadcast", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  }, [socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: input, sender: user },
      ]);
      setInput("");
      socket.emit("send_message", { message: input, sender: user });
    }
  };
  if (!active) {
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
    <div className=" h-screen w-full ">
      <div className="sticky top-0 flex items-center gap-2 border-l-2 border-gray-600 p-2 py-2 text-white dark:bg-DarkButNotBlack">
        <div onClick={() => setActive(null)} className=" text-lg sm:hidden">
          <BiArrowBack />
        </div>
        <Image
          src={active?.image || "/PngItem_307416.png"}
          alt=""
          width={50}
          height={50}
          className={`rounded-full ${
            active?.name === "Chat Lounge" ? "hidden" : ""
          }`}
        ></Image>
        <p className=" p-2">{active?.name}</p>
      </div>

      <div className="flex h-screen flex-col overflow-y-scroll">
        {messages.map((message) => {
          if (message.sender.email === user.email) {
            return (
              <div
                className="m-2 flex w-fit items-center justify-center gap-4 self-end rounded-3xl bg-green-600 p-2 px-4"
                key={uuidv4()}
              >
                <p>{message.message}</p>
              </div>
            );
          }
          return (
            <div
              className="m-2 flex w-fit items-center justify-center gap-4 rounded-3xl bg-DarkButNotBlack p-2 pr-4"
              key={uuidv4()}
            >
              <Image
                src={message?.sender?.image || "/PngItem_307416.png"}
                alt=""
                width={30}
                height={30}
                className={`rounded-full`}
              ></Image>
              <p>{message.message}</p>
            </div>
          );
        })}
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
