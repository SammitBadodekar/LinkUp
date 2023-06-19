"use client";
import Loading from "@/components/loading";
import { UserContext } from "@/context/userContext";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useContext, useEffect } from "react";

export default function Home() {
  const [user, setuser] = useContext(UserContext);
  const session = useSession();
  useEffect(() => {
    setuser(session.data?.user);
  }, [session.data?.user]);

  console.log(session.status);
  console.log(session.data?.user);
  if (session.status === "unauthenticated") {
    redirect("/login");
  }
  if (session.status === "loading") {
    return <Loading />;
  }

  return <main className="">Home</main>;
}
