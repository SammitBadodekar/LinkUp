"use client";

import { useState, useRef, useEffect, useContext } from "react";
import { UserContext } from "@/context/userContext";
import Image from "next/image";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import Profile from "./profile";

const Navbar = () => {
  const [isClicked, setIsClicked] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsClicked(false);
      }
    };

    if (isClicked) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isClicked]);

  return (
    <div
      className={`z-50 flex justify-between bg-DarkButNotBlack p-2 px-4 shadow-lg`}
    >
      <Image
        src={user?.image || "/PngItem_307416.png"}
        width={50}
        height={50}
        alt="profile"
        className=" cursor-pointer rounded-full object-cover"
        onClick={() => setIsClicked(!isClicked)}
      />

      <div className=" flex items-center gap-6 text-xl dark:text-slate-200">
        <BsFillChatLeftTextFill />
        <BsThreeDotsVertical />
      </div>

      <div ref={modalRef} className=" fixed z-50 flex justify-center">
        <Profile user={user} open={isClicked} setOpen={setIsClicked} />
      </div>
    </div>
  );
};
export default Navbar;
