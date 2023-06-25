import { BiArrowBack } from "react-icons/bi";

const NewChats = (props) => {
  const { addNewChats, setAddNewChats } = props;
  return (
    <div
      className={`newChats fixed left-0 top-0 bottom-0 overflow-y-scroll dark:text-white flex flex-col justify-between dark:bg-darkTheme gap-2 ${
        addNewChats ? "open" : ""
      }`}
    >
      <h1
        className=" absolute top-0 p-4 -ml-8 w-full text-xl font-bold flex gap-4 items-center dark:bg-DarkButNotBlack"
        onClick={() => {
          setAddNewChats(!addNewChats);
        }}
      >
        <BiArrowBack />
        New Chats
      </h1>
      NewChats
    </div>
  );
};
export default NewChats;
