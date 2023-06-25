import { BsChatDots } from "react-icons/bs";
import { IconContext } from "react-icons";

const Chat = (props) => {
  const { active } = props;
  if (!active) {
    return (
      <div className="flex justify-center items-center gap-4 flex-col ">
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
          <span className=" font-extrabold text-xl">LinkUp!</span>
        </p>
      </div>
    );
  }
  return <div className=" h-full w-full">Chats form {active}</div>;
};
export default Chat;
