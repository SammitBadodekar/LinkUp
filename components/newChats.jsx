import { useEffect, useState, useContext } from "react";
import { BiArrowBack } from "react-icons/bi";
import { UserContext } from "@/context/userContext";
import toast from "react-hot-toast";
import Image from "next/image";
import Loading from "./loading";
import debounce from "lodash.debounce";

const NewChats = (props) => {
  const { setRequests, requests, friends, user, allUsers, setAllUsers } =
    useContext(UserContext);
  const { socket, addNewChats, setAddNewChats } = props;

  const [searchUsers, setSearchUsers] = useState([]);

  const handleSearch = (searchInput) => {
    const searchResult = [];
    allUsers.map((input) => {
      if (
        input.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        input.email.toLowerCase().includes(searchInput.toLowerCase())
      ) {
        searchResult.push(input);
      }
    });
    setSearchUsers(searchResult);
  };

  const debounceSearch = debounce((searchInput) => {
    handleSearch(searchInput);
  }, 500);

  const addFriend = (receiver) => {
    const isDuplicate = requests?.some(
      (item) => item?.receiver?.email === receiver?.email
    );
    const alreadyReceived = requests?.some(
      (item) => item?.sender?.email === receiver?.email
    );
    try {
      if (isDuplicate) {
        toast((t) => (
          <span className=" flex gap-2">
            <p>Already requested {receiver.name}</p>
            <button
              className=" rounded-lg bg-slate-300 p-2 shadow-xl"
              onClick={() => toast.dismiss(t.id)}
            >
              Dismiss
            </button>
          </span>
        ));
      } else if (alreadyReceived)
        toast((t) => (
          <span className=" flex gap-2">
            <p>{receiver.name} has already sent you request</p>
            <button
              className=" rounded-lg bg-slate-300 p-2 shadow-xl"
              onClick={() => toast.dismiss(t.id)}
            >
              Dismiss
            </button>
          </span>
        ));
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
        }).then(
          toast((t) => (
            <span className=" flex gap-2">
              <p>Request sent to {receiver.name}</p>
              <button
                className=" rounded-lg bg-slate-300 p-2 shadow-xl"
                onClick={() => toast.dismiss(t.id)}
              >
                Dismiss
              </button>
            </span>
          ))
        );
      }
    } catch (error) {
      toast(`Error: request not sent`);
    }
  };

  useEffect(() => {
    fetch(
      ` https://linkup-backend.vercel.app/getAllUsers `
    ) /*http://localhost:3001/getAllUsers*/
      .then((resp) => resp.json())
      .then((data) => {
        setAllUsers(Object.values(data));
        setSearchUsers(Object.values(data));
      });
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
      className={`newChats fixed bottom-0 left-0 top-0 z-20 flex w-screen flex-col gap-4 overflow-y-scroll border-r-2 border-slate-300 bg-white dark:border-slate-600  dark:bg-darkTheme dark:text-white  ${
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
      <div className=" flex items-center justify-center">
        <input
          type="text"
          placeholder="search"
          className=" w-4/5 rounded-lg bg-slate-300 p-2 dark:bg-slate-600 dark:placeholder:text-slate-400"
          onChange={(e) => debounceSearch(e.target.value)}
        />
      </div>
      <p
        className={`${
          searchUsers.length !== 0 ? "hidden" : ""
        } text-center text-xl font-extrabold `}
      >
        No User With That Name
      </p>
      <div className=" mt-0 px-2">
        {searchUsers?.map((singleUser) => {
          const userTag = singleUser.email.split("@")[0];
          const isFriend = friends?.some(
            (item) => item?.email === singleUser?.email
          );
          if (user?.email === singleUser?.email || isFriend) return;

          return (
            <article
              key={singleUser.email}
              className=" relative w-full items-center p-4"
            >
              <div className=" flex gap-2">
                <Image
                  src={singleUser?.image || "/PngItem_307416.png"}
                  width={50}
                  height={50}
                  alt="profile"
                  className=" aspect-square rounded-full object-cover"
                />
                <div>
                  <p>{singleUser?.name}</p>
                  <p className=" text-xs text-slate-400">@{userTag}</p>
                </div>
              </div>

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
