"use client";
import { useSession } from "next-auth/react";
import ToggleButton from "@/components/toggleButton";
import { useContext, useState } from "react";
import { UserContext } from "@/context/userContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";
import Link from "next/link";

const Page = () => {
  const session = useSession();
  const { user } = useContext(UserContext);
  const [nameInput, setNameInput] = useState(user?.name);
  const [bioInput, setBioInput] = useState(user?.bio ? user?.bio : "");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(nameInput);
    console.log(bioInput);
    if (session.data?.user) {
      const updateRaw = await fetch("/api/users/update", {
        method: "PUT",
        body: JSON.stringify({
          name: nameInput,
          bio: bioInput,
          email: session.data.user.email,
        }),
      });
      const updateResponseOk = updateRaw.ok;
      if (updateResponseOk) {
        toast.success("Successfully updated profile");
      } else {
        toast.error("something went wrong");
      }
      router.push("/");
    }
  };

  return (
    <div className=" flex h-screen items-center justify-center ">
      <button className=" absolute right-4 top-8 sm:top-4">
        <ToggleButton />
      </button>
      <Link
        href="/"
        className=" absolute left-4 top-8 flex w-fit items-center gap-2 rounded-md bg-slate-400 p-1 text-darkTheme sm:top-4"
      >
        <BiArrowBack /> <p>Home</p>
      </Link>
      <form
        className="mx-2 flex flex-col content-center justify-center gap-2 rounded-2xl bg-slate-200 p-6 shadow-2xl dark:bg-DarkButNotBlack"
        onSubmit={handleSubmit}
      >
        <label htmlFor="">Name</label>
        <input
          type="text"
          value={nameInput}
          className=" fo rounded-md bg-slate-300 p-1 px-2 text-sm dark:bg-slate-600"
          onChange={(e) => setNameInput(e.target.value)}
        />
        <label htmlFor="">Email</label>
        <p className=" rounded-md bg-slate-300 p-2 text-xs text-slate-500 dark:bg-slate-600 dark:text-slate-400">
          {session.data?.user.email}
        </p>
        <label htmlFor="">Bio</label>
        <textarea
          name=""
          id=""
          cols="3"
          rows="3"
          value={bioInput}
          className=" rounded-md bg-slate-300 p-2 placeholder:text-sm placeholder:text-darkTheme dark:bg-slate-600 dark:placeholder:text-slate-300"
          placeholder="Anything about yourself !!"
          onChange={(e) => setBioInput(e.target.value)}
        ></textarea>
        <button
          type="submit"
          className=" rounded-md bg-slate-400 p-1 dark:bg-slate-300 dark:text-darkTheme"
        >
          Save
        </button>
      </form>
    </div>
  );
};
export default Page;
