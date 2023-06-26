"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";

const Page = () => {
  const session = useSession();
  useEffect(() => {
    if (session.data?.user) {
      fetch("/api/users/create", {
        method: "PUT",
        body: JSON.stringify({
          name: session.data?.user.name,
          email: session.data?.user.email,
          image: session.data?.user.image,
        }),
      });
      redirect("/");
    }
  }, [session.data]);
  return (
    <div className="loginPage flex h-screen w-screen items-center justify-center bg-cover">
      <div className="flex h-screen w-full flex-col items-center justify-center gap-8 bg-white pt-40 text-center dark:bg-darkTheme dark:text-white sm:mx-20 sm:h-80 sm:rounded-2xl sm:pt-0 md:mx-40 xl:mx-60 2xl:mx-96">
        <div className=" fixed -top-4 left-0 right-0 h-52 bg-loginImg bg-cover sm:hidden"></div>
        <h1 className=" text-3xl">Welcome!!</h1>
        <p className=" mx-4">
          Connect, Chat, and Collaborate in Real Time with{" "}
          <span className=" text-xl font-extrabold">LinkUp!</span>
        </p>
        <button
          className=" flex items-center gap-2 rounded-md bg-darkTheme p-2 font-bold text-darkTheme dark:bg-white"
          onClick={() => signIn("google")}
        >
          <FcGoogle />
          Login with Google
        </button>
      </div>
    </div>
  );
};
export default Page;
