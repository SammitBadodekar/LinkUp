"use client";
import Loading from "@/components/loading";
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
      console.log("req sent");
      redirect("/");
    }
  }, [session.data]);

  if (session.status === "loading") return <Loading />;
  return (
    <div className="loginPage w-screen h-screen flex justify-center items-center bg-cover">
      <div className="bg-white dark:bg-darkTheme w-full h-screen sm:rounded-2xl flex justify-center pt-40 sm:pt-0 items-center sm:mx-20 sm:h-80 2xl:mx-96 xl:mx-60 md:mx-40 dark:text-white flex-col gap-8 text-center">
        <div className=" fixed h-52 bg-loginImg -top-4 left-0 right-0 rounded-3xl bg-cover sm:hidden"></div>
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
      </div>
    </div>
  );
};
export default Page;
