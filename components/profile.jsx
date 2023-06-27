import Image from "next/image";
import { BiArrowBack } from "react-icons/bi";
import { signOut } from "next-auth/react";

const Profile = (props) => {
  const { user, open, setOpen } = props;
  return (
    <div
      className={`profile fixed bottom-0 left-0 top-0 flex flex-col justify-between gap-2 overflow-y-scroll dark:bg-darkTheme dark:text-white ${
        open ? "open" : ""
      }`}
    >
      <section className="flex flex-col gap-2 p-8">
        <h1
          className="fixed top-0 z-50 -ml-8 flex w-full items-center gap-4 p-4 text-xl font-bold dark:bg-DarkButNotBlack"
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
          className="mt-20 self-center rounded-full"
        />
        <p className=" text-slate-400">Your Name</p>
        <p>{user?.name}</p>
        <p className=" text-slate-400">Your Email</p>
        <p>{user?.email}</p>
      </section>

      <button
        className=" m-8 rounded-md bg-slate-600 p-2 text-white dark:bg-slate-200 dark:text-darkTheme"
        onClick={() => signOut()}
      >
        Logout
      </button>
    </div>
  );
};
export default Profile;
