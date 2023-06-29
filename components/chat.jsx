import { BsChatDots } from "react-icons/bs";
import { IconContext } from "react-icons";
import { BiArrowBack } from "react-icons/bi";
import Image from "next/image";

const Chat = (props) => {
  const { active, setActive } = props;
  if (!active) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 ">
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
        <p className=" mx-4 dark:text-white">
          Connect, Chat, and Collaborate in Real Time with{" "}
          <span className=" text-xl font-extrabold">LinkUp!</span>
        </p>
      </div>
    );
  }
  return (
    <div className=" h-full w-full ">
      <div className="sticky top-0 flex items-center gap-2 border-l-2 border-gray-600 p-2 text-white dark:bg-DarkButNotBlack">
        <div onClick={() => setActive(null)} className=" text-lg sm:hidden">
          <BiArrowBack />
        </div>
        <Image
          src={active?.image || "/PngItem_307416.png"}
          alt=""
          width={50}
          height={50}
          className=" rounded-full"
        ></Image>
        <p>{active?.name}</p>
      </div>
      Chats form {active?.name}
    </div>
  );
};
export default Chat;
