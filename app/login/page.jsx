"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const page = () => {
  const session = useSession();
  if (session.data?.user) redirect("/");
  return (
    <div className="loginPage w-screen h-screen flex justify-center items-center bg-cover">
      <div className="bg-white dark:bg-darkTheme w-full mx-8 h-96 rounded-2xl flex justify-center items-center sm:mx-20 sm:h-80 2xl:mx-96 xl:mx-60 md:mx-40 dark:text-white flex-col gap-4">
        <h1>login</h1>
        <button
          className=" p-4 rounded-md bg-white text-darkTheme"
          onClick={() => signIn("google")}
        >
          Login with Google
        </button>
        <button
          className=" p-4 rounded-md bg-white text-darkTheme"
          onClick={() => signOut()}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
export default page;
