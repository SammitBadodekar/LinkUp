import Image from "next/image";
import { BiArrowBack } from "react-icons/bi";
import { signOut } from "next-auth/react";

const Profile = (props) => {
  const { user, open, setOpen } = props;
  return (
    <div
      className={`profile fixed left-0 top-0 bottom-0 overflow-y-scroll dark:text-white flex flex-col justify-between dark:bg-darkTheme gap-2 ${
        open ? "open" : ""
      }`}
    >
      <section className="flex flex-col gap-2 p-8">
        <h1
          className="fixed top-0 p-4 -ml-8 w-full text-xl font-bold flex gap-4 items-center dark:bg-DarkButNotBlack"
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
          className="rounded-full self-center mt-20"
        />
        <p className=" text-slate-400">Your Name</p>
        <p>{user?.name}</p>
        <p className=" text-slate-400">Your Email</p>
        <p>{user?.email}</p>
      </section>

      <button
        className=" p-2 m-4 rounded-md bg-slate-600 text-white dark:bg-slate-200 dark:text-darkTheme"
        onClick={() => signOut()}
      >
        Logout
      </button>
    </div>
  );
};
export default Profile;
