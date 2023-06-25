import { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import Image from "next/image";

const NewChats = (props) => {
  const { addNewChats, setAddNewChats } = props;
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      const userInfo = await fetch(`/api/getAllUsers`);
      const result = await userInfo.json();
      setAllUsers(Object.entries(result));
    };
    fetchAllUsers();
  }, []);
  return (
    <div
      className={`newChats fixed left-0 top-0 bottom-0 overflow-y-scroll dark:text-white flex flex-col justify-between dark:bg-darkTheme gap-2 ${
        addNewChats ? "open" : ""
      }`}
    >
      <h1
        className=" fixed lg:sticky z-20 w-full top-0 p-4 text-xl font-bold flex gap-4 items-center dark:bg-DarkButNotBlack"
        onClick={() => {
          setAddNewChats(!addNewChats);
        }}
      >
        <BiArrowBack />
        New Chats
      </h1>
      <div className=" px-2 mt-0">
        {allUsers.map(([key, value]) => {
          return (
            <article
              key={key}
              className=" flex gap-2 p-4 items-center relative"
            >
              <Image
                src={value?.image || "/PngItem_307416.png"}
                width={50}
                height={50}
                alt="profile"
                className=" rounded-full object-cover"
              />
              <p>{value?.name}</p>
              <button className=" absolute top-6 right-4 rounded-xl p-2 dark:bg-slate-600 text-xs">
                Add
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
};
export default NewChats;
