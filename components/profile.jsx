import Image from "next/image";
import { BiArrowBack, BiEditAlt } from "react-icons/bi";
import { signOut } from "next-auth/react";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";
import Link from "next/link";

const Profile = (props) => {
  const { open, setOpen } = props;
  const { user } = useContext(UserContext);

  return (
    <div
      className={`profile fixed bottom-0 left-0 top-0 flex flex-col justify-between gap-2 overflow-y-scroll bg-white dark:bg-darkTheme dark:text-white ${
        open ? "open" : ""
      }`}
    >
      <section className="flex flex-col gap-2 p-8">
        <button className="absolute right-4 top-20 z-50 rounded-lg bg-slate-400 p-1 text-darkTheme ">
          <Link href="/edit-profile" className=" flex items-center gap-2 px-2">
            <BiEditAlt />
            <p>Edit</p>
          </Link>
        </button>
        <h1
          className="fixed top-0 z-50 -ml-8 flex w-full items-center gap-4 bg-slate-100 p-4 text-xl font-bold shadow-lg dark:bg-DarkButNotBlack"
          onClick={() => {
            setOpen(!open);
          }}
        >
          <BiArrowBack />
          Profile
        </h1>
        <Image
          src={user?.image || "/PngItem_307416.png"}
          alt=""
          width={100}
          height={100}
          className="mt-20 aspect-square self-center rounded-full"
        />
        <p className=" text-slate-400">Your Name</p>
        <p>{user?.name}</p>
        <p className=" text-slate-400">Your Email</p>
        <p>{user?.email}</p>
        <p className=" text-slate-400">{user?.bio === "" ? "" : "bio"}</p>
        <p>{user?.bio}</p>
      </section>

      <button
        className=" m-4 rounded-md  bg-slate-400 p-2 text-darkTheme"
        onClick={() => signOut()}
      >
        Logout
      </button>
    </div>
  );
};
export default Profile;
