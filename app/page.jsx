"use client";
import Loading from "@/components/loading";
import Chatlist from "@/components/chatlist";
import Navbar from "@/components/Navbar";
import Chat from "@/components/chat";
import { UserContext } from "@/context/userContext";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Home() {
  const [section, setSection] = useState("chat");
  const [user, setUser] = useContext(UserContext);
  const [active, setActive] = useState(null);
  const session = useSession();
  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await fetch(`/api/users/${session.data.user.email}`);
      const result = await userInfo.json();
      setUser(result[0]);
    };
    if (session.data?.user) {
      fetchUserInfo();
    }
  }, [session.data?.user]);

  if (session.status === "unauthenticated") {
    redirect("/login");
  }
  if (session.status === "loading") {
    return <Loading />;
  }

  return (
    <main>
      <div className=" sm:w-1/3">
        <Navbar user={user} />
      </div>

      <div></div>
      <div className="flex gap-4">
        <button
          onClick={() => setSection("chat")}
          className={`btn-navigation dark:text-slate-200 text-black ${
            section === "chat" ? " border-b-2 border-white" : ""
          }`}
        >
          Chats
        </button>
        <button
          onClick={() => setSection("request")}
          className={`btn-navigation dark:text-slate-200 text-black ${
            section === "request" ? " border-b-2 border-white" : ""
          }`}
        >
          Requests
        </button>
      </div>
      <div className={`${section === "chat" ? "chat" : " hidden"} `}>
        <div>
          <Chatlist
            friends={user?.friends}
            active={active}
            setActive={setActive}
          />
        </div>
        <div>
          <Chat active={active} />
        </div>
      </div>
    </main>
  );
}
