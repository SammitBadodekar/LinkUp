"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Profile from "./profile";
import ToggleButton from "./toggleButton";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";

const Navbar = (props) => {
  const { isClicked, setIsClicked } = props;
  const { user } = useContext(UserContext);
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

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={`z-50 flex justify-between bg-slate-100 p-2 px-4 shadow-2xl dark:bg-DarkButNotBlack`}
    >
      <Image
        src={user?.image || ""}
        width={50}
        height={50}
        alt="profile"
        className=" aspect-square cursor-pointer rounded-full object-cover"
        onClick={() => setIsClicked(!isClicked)}
      />
      <ToggleButton />
      <div ref={modalRef} className=" fixed z-50 flex justify-center">
        <Profile open={isClicked} setOpen={setIsClicked} />
      </div>
    </div>
  );
};
export default Navbar;
