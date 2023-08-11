import { useEffect, useState, useContext } from "react";
import { BiArrowBack } from "react-icons/bi";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { UserContext } from "@/context/userContext";
import toast from "react-hot-toast";
import Image from "next/image";
import Loading from "./loading";
import debounce from "lodash.debounce";

const NewChats = (props) => {
  const {
    setRequests,
    requests,
    friends,
    user,
    allUsers,
    setAllUsers,
    setIsModalOpen,
    setProfileModalText,
  } = useContext(UserContext);
  const { socket, addNewChats, setAddNewChats } = props;

  const [searchUsers, setSearchUsers] = useState([]);
  const [input, setInput] = useState("");
  const [pageCounter, setPageCounter] = useState(21);

  const showUsers = (pageStart, pageEnd, allUsers) => {
    setSearchUsers(allUsers?.slice(pageStart, pageEnd));
  };

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
    setInput(searchInput);
    if (searchInput.length === 0) {
      showUsers(pageCounter - 20, pageCounter, allUsers);
    }
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
        showUsers(0, 21, Object.values(data));
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
          Users
        </h1>
        <Loading />
      </div>
    );
  }
  return (
    <div
      className={`newChats fixed bottom-0 left-0 top-0 z-20 flex w-screen flex-col border-r-2 border-slate-300 bg-white dark:border-slate-600  dark:bg-darkTheme dark:text-white  ${
        addNewChats ? "newChats open" : ""
      }`}
    >
      <h1
        className="z-20 flex w-full items-center gap-4 bg-slate-100  p-2 px-4 text-xl font-bold dark:bg-DarkButNotBlack"
        onClick={() => {
          setAddNewChats(false);
        }}
      >
        <BiArrowBack />
        Users
      </h1>
      <div className=" relative -mt-2 flex items-center justify-between bg-slate-100 p-2 px-4 shadow-lg dark:bg-DarkButNotBlack">
        <input
          type="text"
          placeholder="search"
          className="w-full rounded-2xl border-2  bg-slate-300 p-2 focus:border-transparent  dark:bg-darkTheme dark:placeholder:text-slate-300"
          onChange={(e) => debounceSearch(e.target.value)}
        />
        <button className=" absolute right-8 ">
          <HiOutlineMagnifyingGlass />
        </button>
      </div>
      <p
        className={`${
          searchUsers.length !== 0 ? "hidden" : ""
        } text-center text-xl font-extrabold `}
      >
        No User With That Name
      </p>
      <div className=" mt-0 overflow-y-scroll px-2">
        <p
          className={` p-2 text-center text-slate-400 ${
            input.length > 0 ? "hidden" : ""
          }`}
        >
          Showing result {pageCounter - 20}-
          {pageCounter >= allUsers?.length ? allUsers?.length : pageCounter - 1}{" "}
          out of {allUsers?.length}{" "}
        </p>
        {searchUsers?.map((singleUser) => {
          const userTag = singleUser.email.split("@")[0];
          const isFriend = friends?.some(
            (item) => item?.email === singleUser?.email
          );
          let isSelf = false;
          if (user?.email === singleUser?.email) isSelf = true;
          return (
            <article
              key={singleUser.email}
              className=" relative w-full items-center p-4"
            >
              <div
                className=" flex gap-2"
                onClick={() => {
                  setIsModalOpen((prev) => !prev);
                  setProfileModalText([
                    `${singleUser?.image}`,
                    `${singleUser?.name}`,
                    `${singleUser?.email}`,
                  ]);
                  setAddNewChats(false);
                }}
              >
                <Image
                  src={singleUser?.image || "/PngItem_307416.webp"}
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
                className={`absolute right-4 top-6 rounded-xl p-1 text-sm  ${
                  !isSelf && !isFriend
                    ? "bg-slate-400 font-bold text-darkTheme"
                    : "text-center"
                }`}
                onClick={() => {
                  if (!isSelf && !isFriend) {
                    addFriend(singleUser);
                  }
                }}
              >
                {isSelf ? "you" : isFriend ? "Friend" : "Add"}
              </button>
            </article>
          );
        })}
        <div
          className={`flex items-center  justify-between border-t-2 p-4 text-darkTheme dark:border-slate-600 ${
            input.length > 0 ? "hidden" : ""
          }`}
        >
          <button
            onClick={() => {
              setPageCounter((prev) => prev - 20);
              showUsers(pageCounter - 40, pageCounter - 20, allUsers);
            }}
            className={`${
              pageCounter <= 21 ? " invisible" : ""
            } rounded-md bg-slate-400 p-1`}
          >
            Previous
          </button>
          <p className=" text-slate-400">
            {pageCounter - 20}-
            {pageCounter >= allUsers?.length
              ? allUsers?.length
              : pageCounter - 1}
          </p>
          <button
            onClick={() => {
              setPageCounter((prev) => prev + 20);
              showUsers(pageCounter, pageCounter + 20, allUsers);
            }}
            className={`${
              pageCounter >= allUsers?.length ? " invisible" : ""
            } rounded-md bg-slate-400 p-1`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
export default NewChats;
