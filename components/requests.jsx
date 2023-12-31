import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { useContext, useRef } from "react";
import { UserContext } from "@/context/userContext";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const Requests = (props) => {
  const { section } = props;
  const { user, requests, setRequests, setFriends, friends } =
    useContext(UserContext);
  const [parent, enableAnimations] = useAutoAnimate();

  const addFriend = (sender) => {
    const updatedFriends = [sender, ...friends];
    const updatedRequests = requests.filter(
      (request) => request.sender?.email !== sender?.email
    );
    setRequests(updatedRequests);
    setFriends(updatedFriends);
    fetch("/api/addFriend", {
      method: "PUT",
      body: JSON.stringify({
        user,
        updatedFriends,
        updatedRequests,
        sender,
      }),
    }).then(
      toast((t) => (
        <span className=" flex gap-2">
          <p>{sender.name} is now your friend</p>
          <button
            className=" rounded-lg bg-slate-300 p-2 shadow-xl"
            onClick={() => toast.dismiss(t.id)}
          >
            Dismiss
          </button>
        </span>
      ))
    );
    fetch("/api/chatRooms/create", {
      method: "PUT",
      body: JSON.stringify({
        user: { name: user.name, email: user.email, image: user.image },
        friend: { name: sender.name, email: sender.email, image: sender.image },
      }),
    });
  };
  const removeRequest = async (sender) => {
    const updatedRequests = await requests.filter(
      (request) => request.sender?.email !== sender?.email
    );
    setRequests(updatedRequests);
    fetch("/api/removeRequest", {
      method: "PUT",
      body: JSON.stringify({
        user,
        updatedRequests,
        sender,
      }),
    }).then(
      toast((t) => (
        <span className=" flex gap-2">
          <p>Deleted request from {sender.name}</p>
          <button
            className=" rounded-lg bg-slate-300 p-2 shadow-xl"
            onClick={() => toast.dismiss(t.id)}
          >
            Dismiss
          </button>
        </span>
      ))
    );
  };
  const withdrawRequest = async (receiver) => {
    const updatedRequests = await requests.filter(
      (request) => request.receiver?.email !== receiver?.email
    );
    setRequests(updatedRequests);
    fetch("/api/removeRequest", {
      method: "PUT",
      body: JSON.stringify({
        user,
        updatedRequests,
        sender: receiver,
      }),
    }).then(
      toast((t) => (
        <span className=" flex gap-2">
          <p>Withdrawn request of {receiver.name}</p>
          <button
            className=" rounded-lg bg-slate-300 p-2 shadow-xl"
            onClick={() => toast.dismiss(t.id)}
          >
            Dismiss
          </button>
        </span>
      ))
    );
  };

  return (
    <div
      className={`request absolute top-28 overflow-y-scroll p-2 duration-300 ease-in ${
        section === "request" ? "translate-x-0 " : " -translate-x-full"
      }`}
    >
      <div className="">
        <h1 className=" text-xl font-extrabold">Received :</h1>
        <div className=" relative  mt-2" ref={parent}>
          {requests.map((request) => {
            if (request.type !== "received") return;
            return (
              <article
                key={request.sender?.email}
                className=" flex items-center gap-2 rounded-xl bg-slate-200 p-2  dark:bg-DarkButNotBlack"
              >
                <Image
                  src={request.sender.image || "/PngItem_307416.webp"}
                  alt=""
                  width={40}
                  height={40}
                  className=" rounded-full"
                ></Image>
                <p className=" mr-20">{request.sender.name}</p>
                <div className="absolute right-2   flex gap-2">
                  <button
                    className="rounded-full bg-slate-400 px-2 text-sm font-bold text-darkTheme"
                    onClick={() => addFriend(request.sender)}
                  >
                    ✓
                  </button>
                  <button
                    className="rounded-full bg-slate-400 px-2 text-darkTheme"
                    onClick={() => removeRequest(request.sender)}
                  >
                    ✖
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <div className=" my-8">
        <h1 className=" text-xl font-extrabold">Sent :</h1>
        <div className=" mt-2" ref={parent}>
          {requests.map((request) => {
            if (request.type !== "sent") return;
            return (
              <article
                key={request.receiver._id}
                className=" relative m-1 my-2 flex rounded-xl  bg-slate-200 px-2 py-4 dark:bg-DarkButNotBlack"
              >
                <div className=" mr-20 flex items-center gap-2 text-sm">
                  <Image
                    src={request.receiver.image || "/PngItem_307416.webp"}
                    alt=""
                    width={40}
                    height={40}
                    className=" rounded-full "
                  ></Image>
                  <p>{request.receiver.name}</p>
                </div>

                <button
                  className=" absolute right-1 top-3 mx-1 my-2 rounded-2xl bg-slate-400 p-1 text-sm font-bold text-darkTheme"
                  onClick={() => withdrawRequest(request.receiver)}
                >
                  withdraw
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Requests;
