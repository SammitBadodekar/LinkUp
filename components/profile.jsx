import Image from "next/image";
import { UserContext } from "@/context/userContext";
import { useContext } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { signOut } from "next-auth/react";

const Profile = (props) => {
  const [user, setuser] = useContext(UserContext);
  const { open, setOpen } = props;
  return (
    <div
      className={`profile fixed right-0 top-0 bottom-0 p-4 dark:text-white flex flex-col items-center dark:bg-gray-700 gap-4 ${
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
      <p className=" text-xs -mt-2 text-slate-300">{user?.email}</p>
      <button
        className=" p-2 rounded-md bg-slate-600 text-white dark:bg-white dark:text-darkTheme"
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
export default Profile;
