import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";

const Requests = () => {
  const { user, requests, setRequests, setFriends, friends } =
    useContext(UserContext);
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
    }).then(toast(`Added ${sender.name}`));
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
    }).then(toast(`Removed ${sender.name}`));
  };

  return (
    <div className="request mt-4 h-full overflow-y-scroll p-2">
      <div className="">
        <h1 className=" text-xl">Received:</h1>
        <div className=" relative  mt-2">
          {requests.map((request) => {
            if (request.type !== "received") return;
            return (
              <article
                key={request.sender?.email}
                className=" flex items-center gap-4 p-1"
              >
                <Image
                  src={request.sender.image || "/PngItem_307416.png"}
                  alt=""
                  width={40}
                  height={40}
                  className=" rounded-full"
                ></Image>
                <p>{request.sender.name}</p>
                <div className="flex gap-2">
                  <button
                    className=" rounded-full px-2 dark:bg-DarkButNotBlack"
                    onClick={() => addFriend(request.sender)}
                  >
                    ✓
                  </button>
                  <button
                    className=" rounded-full px-2 dark:bg-DarkButNotBlack"
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
        <h1 className=" text-xl">Sent:</h1>
        <div className=" mt-2">
          {requests.map((request) => {
            if (request.type !== "sent") return;
            return (
              <article
                key={request.receiver._id}
                className=" flex items-center gap-4 p-1"
              >
                <Image
                  src={request.receiver.image || "/PngItem_307416.png"}
                  alt=""
                  width={40}
                  height={40}
                  className=" rounded-full"
                ></Image>
                <p>{request.receiver.name}</p>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Requests;
