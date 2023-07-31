"use client";
import { useSession } from "next-auth/react";
import ToggleButton from "@/components/toggleButton";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";
import { useEffect, useState } from "react";
import Link from "next/link";

const Page = () => {
  const { data: session, update } = useSession();
  const [nameInput, setNameInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const router = useRouter();

  useEffect(() => {
    setNameInput(localStorage.getItem("name") || session?.user?.name);
    setBioInput(localStorage.getItem("bio") || "");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (session?.user) {
      toast.promise(
        fetch("/api/users/update", {
          method: "PUT",
          body: JSON.stringify({
            name: nameInput,
            bio: bioInput,
            email: session.user.email,
          }),
        }),
        {
          loading: "Saving",
          success: "Successfully Saved Profile",
          error: "Something went wrong",
        }
      );
      localStorage.setItem("bio", bioInput);
      localStorage.setItem("name", nameInput);
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  };

  return (
    <div className="flex w-screen justify-center sm:h-screen sm:items-center">
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
        className="m-2 mt-20 flex h-fit w-full flex-col gap-2 rounded-2xl bg-slate-200 p-6 shadow-2xl dark:bg-DarkButNotBlack sm:mt-4 sm:w-fit sm:px-10 "
        onSubmit={handleSubmit}
      >
        <h1 className=" text-center text-xl font-extrabold">Edit Profile</h1>
        <label htmlFor="">Name</label>
        <input
          type="text"
          value={nameInput}
          className=" fo rounded-md bg-slate-300 p-1 px-2 text-sm dark:bg-slate-600"
          onChange={(e) => setNameInput(e.target.value)}
        />
        <label htmlFor="">Email</label>
        <p className=" rounded-md bg-slate-300 p-2 text-xs text-slate-500 dark:bg-slate-600 dark:text-slate-400">
          {session?.user.email}
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
