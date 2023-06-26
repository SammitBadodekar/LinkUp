import { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
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
      className={`newChats fixed bottom-0 left-0 top-0 z-20 flex flex-col justify-between gap-2 overflow-y-scroll dark:bg-darkTheme dark:text-white ${
        addNewChats ? "open" : ""
      }`}
    >
      <h1
        className=" fixed top-0 z-20 flex w-full items-center gap-4 p-4 text-xl font-bold dark:bg-DarkButNotBlack lg:sticky"
        onClick={() => {
          setAddNewChats(!addNewChats);
        }}
      >
        <BiArrowBack />
        New Chats
      </h1>
      <div className=" mt-0 px-2">
        {allUsers.map(([key, value]) => {
          return (
            <article
              key={key}
              className=" relative flex items-center gap-2 p-4"
            >
              <Image
                src={value?.image || "/PngItem_307416.png"}
                width={50}
                height={50}
                alt="profile"
                className=" rounded-full object-cover"
              />
              <p>{value?.name}</p>
              <button
                className=" absolute right-4 top-6 rounded-xl p-2 text-xs dark:bg-slate-600"
                onClick={() => {
                  toast(`Request sent to ${value.name}`);
                  toast(
                    `You will to chat once ${value.name} accepts your Friend request`
                  );
                }}
              >
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
