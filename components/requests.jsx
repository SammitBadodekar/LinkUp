import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

const Requests = (props) => {
  const { user } = props;
  const addFriend = (sender) => {
    const updatedFriends = [sender, ...user?.friends];
    const updatedSenderRequestSent = sender.requestSent.filter(
      (item) => item.email !== user.email
    );
    fetch("/api/addFriend", {
      method: "PUT",
      body: JSON.stringify({
        user,
        updatedFriends,
        sender,
        updatedSenderRequestSent,
      }),
    }).then(toast(`Removed ${sender.name}`));
  };
  const removeRequest = (sender) => {
    const updatedRequests = user?.requestReceived.filter(
      (item) => item.email !== sender.email
    );
    fetch("/api/removeRequest", {
      method: "PUT",
      body: JSON.stringify({
        user,
        updatedRequests,
      }),
    }).then(toast(`Removed ${sender.name}`));
  };
  if (user?.requests) {
    return (
      <div className=" mt-4 h-full p-2">
        <div className="">
          <h1 className=" text-xl">Received:</h1>
          <div className=" relative  mt-2">
            {user?.requests.map((request) => {
              if (request.type !== "received") return;
              return (
                <article
                  key={request.sender.email}
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
            {user?.requests.map((request) => {
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
  }
  return;
};
export default Requests;
