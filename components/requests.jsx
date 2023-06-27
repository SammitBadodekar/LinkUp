import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

const Requests = (props) => {
  const { user } = props;
  const addFriend = (sender) => {
    const updatedFriends = [sender, ...user?.friends];
    fetch("/api/addFriend", {
      method: "PUT",
      body: JSON.stringify({
        user,
        updatedFriends,
        sender,
      }),
    })
      .then(toast(`Removed ${sender.name}`))
      .then(removeRequest(sender));
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

  return (
    <div className="mt-4 h-full p-2">
      <div className="">
        <h1 className=" text-xl">
          Received &#40;{user?.requestReceived.length || "0"}&#41;
        </h1>
        <div className=" mt-2">
          {user?.requestReceived.map((sender) => {
            return (
              <article
                key={sender.email}
                className=" flex items-center gap-4 p-1"
              >
                <Image
                  src={sender.image || "/PngItem_307416.png"}
                  alt=""
                  width={40}
                  height={40}
                  className=" rounded-full"
                ></Image>
                <p>{sender.name}</p>
                <div className=" flex gap-2">
                  <button
                    className=" rounded-full px-2 dark:bg-DarkButNotBlack"
                    onClick={() => addFriend(sender)}
                  >
                    ✓
                  </button>
                  <button
                    className=" rounded-full px-2 dark:bg-DarkButNotBlack"
                    onClick={() => removeRequest(sender)}
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
        <h1 className=" text-xl">
          Sent &#40;{user?.requestSent.length || "0"}&#41;
        </h1>
        <div className=" mt-2">
          {user?.requestSent.map((receiver) => {
            return (
              <article
                key={receiver._id}
                className=" flex items-center gap-4 p-1"
              >
                <Image
                  src={receiver.image || "/PngItem_307416.png"}
                  alt=""
                  width={40}
                  height={40}
                  className=" rounded-full"
                ></Image>
                <p>{receiver.name}</p>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Requests;
