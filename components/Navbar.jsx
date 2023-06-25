"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import Profile from "./profile";

const Navbar = (props) => {
  const { user } = props;
  const [isClicked, setIsClicked] = useState(false);
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
      className={`shadow-lg p-2 flex justify-between px-4 bg-DarkButNotBlack  ${
        !user ? " hidden" : ""
      }`}
    >
      <Image
        src={user?.image || "/PngItem_307416.png"}
        width={50}
        height={50}
        alt="profile"
        className=" rounded-full object-cover cursor-pointer"
        onClick={() => setIsClicked(!isClicked)}
      />

      <div className=" dark:text-slate-200 flex gap-4 items-center">
        <BsFillChatLeftTextFill />
        <BsThreeDotsVertical />
      </div>

      <div ref={modalRef} className=" fixed flex justify-center ">
        <Profile user={user} open={isClicked} setOpen={setIsClicked} />
      </div>
    </div>
  );
};
export default Navbar;
