"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

const Page = () => {
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session?.user) {
      fetch("/api/users/create", {
        method: "PUT",
        body: JSON.stringify({
          name: session?.user?.name,
          email: session?.user?.email,
          image: session?.user?.image,
        }),
      })
        .then((resp) => resp.json())
        .then((user) => {
          console.log(user);
          router.push(
            `/edit-profile?name=${user[0].name}&image=${user[0].image}&imageKey=${user[0].imageKey}&bio=${user[0].bio}`
          );
        });
    }
  }, [session]);
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
          className=" flex items-center gap-2 rounded-md bg-slate-200 p-2 font-bold shadow-xl dark:bg-white dark:text-darkTheme"
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
