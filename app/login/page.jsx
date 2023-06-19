"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

const Page = () => {
  const session = useSession();
  if (session.data?.user) redirect("/");
  return (
    <div className="loginPage w-screen h-screen flex justify-center items-center bg-cover">
      <div className="bg-white dark:bg-darkTheme w-full h-screen sm:rounded-2xl flex justify-center pt-40 sm:pt-0 items-center sm:mx-20 sm:h-80 2xl:mx-96 xl:mx-60 md:mx-40 dark:text-white flex-col gap-8 text-center">
        <div className=" fixed h-52 bg-loginImg top-0 left-3 right-3 my-3 rounded-3xl bg-cover sm:hidden"></div>
        <h1 className=" text-3xl">Welcome!!</h1>
        <p className=" mx-4">
          Connect, Chat, and Collaborate in Real Time with{" "}
          <span className=" font-extrabold text-xl">LinkUp!</span>
        </p>
        <button
          className=" p-2 rounded-md bg-white text-darkTheme flex gap-2 items-center font-bold"
          onClick={() => signIn("google")}
        >
          <FcGoogle />
          Login with Google
        </button>
        {/*  <button
          className=" p-4 rounded-md bg-white text-darkTheme"
          onClick={() => signOut()}
        >
          Logout
        </button> */}
      </div>
    </div>
  );
};
export default Page;
