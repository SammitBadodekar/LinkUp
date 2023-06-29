import { useEffect, useState, useContext } from "react";
import { BiArrowBack } from "react-icons/bi";
import { UserContext } from "@/context/userContext";
import toast from "react-hot-toast";
import Image from "next/image";

const NewChats = (props) => {
  const [user, setUser] = useContext(UserContext);
  const { addNewChats, setAddNewChats } = props;
  const [allUsers, setAllUsers] = useState([]);

  const addFriend = (receiver) => {
    const isDuplicate = user.requests?.some(
      (item) => item?.receiver?.email === receiver?.email
    );
    const alreadyReceived = user.requests?.some(
      (item) => item?.sender?.email === receiver?.email
    );
    try {
      if (isDuplicate) toast(`Already requested ${receiver.name}`);
      else if (alreadyReceived)
        toast(`${receiver.name} has already sent you request`);
      else {
        fetch("/api/sendRequest", {
          method: "PUT",
          body: JSON.stringify({
            sender: {
              name: user.name,
              email: user.email,
              image: user.image,
              requests: user.requests,
              friends: user.friends,
            },
            receiver,
          }),
        }).then(toast(`Request sent to ${receiver.name}`));
      }
    } catch (error) {
      toast(`Error: request not sent`);
    }
  };

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
      className={`newChats fixed bottom-0 left-0 top-0 z-20 flex flex-col justify-between gap-2 overflow-y-scroll pt-20 dark:bg-darkTheme dark:text-white sm:pt-0 ${
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
          const isFriend = user.friends?.some(
            (item) => item?.email === value?.email
          );
          if (value.email === user.email || isFriend) return;

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
                onClick={() => addFriend(value)}
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
