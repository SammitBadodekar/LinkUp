import { useEffect, useState, useContext } from "react";
import { BiArrowBack } from "react-icons/bi";
import { UserContext } from "@/context/userContext";
import toast from "react-hot-toast";
import Image from "next/image";
import Loading from "./loading";

const NewChats = (props) => {
  const { setRequests, requests, friends } = useContext(UserContext);
  const { addNewChats, setAddNewChats, socket, user } = props;
  const [allUsers, setAllUsers] = useState(null);

  const addFriend = (receiver) => {
    const isDuplicate = requests?.some(
      (item) => item?.receiver?.email === receiver?.email
    );
    const alreadyReceived = requests?.some(
      (item) => item?.sender?.email === receiver?.email
    );
    try {
      if (isDuplicate) toast(`Already requested ${receiver.name}`);
      else if (alreadyReceived)
        toast(`${receiver.name} has already sent you request`);
      else {
        socket.emit("send_request", {
          type: "received",
          sender: user,
          receiver,
        });
        setRequests((prev) => [{ type: "sent", receiver }, ...prev]);
        fetch("/api/sendRequest", {
          method: "PUT",
          body: JSON.stringify({
            sender: {
              name: user?.name,
              email: user?.email,
              image: user?.image,
              requests: requests,
              friends: friends,
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
    fetch(
      ` https://linkup-backend-2uhh.onrender.com/getAllUsers `
    ) /*http://localhost:3001/getAllUsers*/
      .then((resp) => resp.json())
      .then((data) => setAllUsers(Object.values(data)));
  }, []);
  if (!allUsers && addNewChats) {
    return (
      <div className=" absolute left-0 right-0 top-0 flex h-screen items-center justify-center bg-white  dark:bg-darkTheme sm:right-2/3">
        <h1
          className=" fixed left-0 right-0 top-0 z-20 flex items-center gap-4 bg-white p-4 text-xl font-bold shadow-lg dark:bg-DarkButNotBlack sm:right-2/3"
          onClick={() => {
            setAddNewChats(false);
          }}
        >
          <BiArrowBack />
          New Chats
        </h1>
        <Loading />
      </div>
    );
  }
  return (
    <div
      className={`newChats fixed bottom-0 left-0  top-0 z-20 flex w-screen flex-col justify-between gap-2 overflow-y-scroll bg-white  dark:bg-darkTheme dark:text-white  ${
        addNewChats ? "newChats open" : ""
      }`}
    >
      <h1
        className="z-20 flex w-full items-center gap-4 bg-slate-100  p-4 text-xl font-bold shadow-lg dark:bg-DarkButNotBlack"
        onClick={() => {
          setAddNewChats(false);
        }}
      >
        <BiArrowBack />
        New Chats
      </h1>
      <div className=" mt-0 px-2">
        {allUsers?.map((singleUser) => {
          const isFriend = friends?.some(
            (item) => item?.email === singleUser?.email
          );
          if (user?.email === singleUser?.email || isFriend) return;

          return (
            <article
              key={singleUser.email}
              className=" relative flex w-full items-center gap-2 p-4"
            >
              <Image
                src={singleUser?.image || "/PngItem_307416.png"}
                width={50}
                height={50}
                alt="profile"
                className=" rounded-full object-cover"
              />
              <p>{singleUser?.name}</p>
              <button
                className=" absolute right-4 top-6 rounded-xl bg-slate-400 p-1 text-sm font-bold text-darkTheme"
                onClick={() => addFriend(singleUser)}
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
