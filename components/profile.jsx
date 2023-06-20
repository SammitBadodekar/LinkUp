import Image from "next/image";
import { UserContext } from "@/context/userContext";
import { useContext } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { signOut } from "next-auth/react";

const profile = (props) => {
  const [user, setuser] = useContext(UserContext);
  const { open, setOpen } = props;
  console.log(user);
  return (
    <div
      className={`profile fixed rounded-2xl p-4 dark:text-white flex flex-col items-center dark:bg-gray-600 gap-4 transition-opacity duration-300 ${
        open ? "open" : ""
      }`}
    >
      <Image
        src={user?.image || "/PngItem_307416.png"}
        alt=""
        width={100}
        height={100}
        className="rounded-full mt-10"
      />
      <p>{user?.name}</p>
      <p>{user?.email}</p>
      <button
        className=" p-2 rounded-md dark:bg-white dark:text-darkTheme"
        onClick={() => signOut()}
      >
        Logout
      </button>
      <div
        onClick={() => {
          setOpen(!open);
        }}
        className=" absolute top-6 right-6"
      >
        <AiOutlineCloseCircle />
      </div>
    </div>
  );
};
export default profile;
