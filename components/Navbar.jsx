"use client";
import { UserContext } from "@/context/userContext";
import { useContext, useState, useRef, useEffect } from "react";
import Image from "next/image";
import Profile from "./profile";

const Navbar = () => {
  const [user, setuser] = useContext(UserContext);
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
      className={`shadow-lg p-2 flex justify-between px-4  ${
        !user ? " hidden" : ""
      }`}
    >
      <Image
        src="/li_nkup-removebg-preview.png"
        width={50}
        height={50}
        alt="LinkUp"
      />
      <Image
        src={user?.image || "/PngItem_307416.png"}
        width={50}
        height={50}
        alt="profile"
        className=" rounded-full object-cover"
        onClick={() => setIsClicked(!isClicked)}
      />
      <div ref={modalRef} className=" fixed">
        <Profile open={isClicked} setOpen={setIsClicked} />
      </div>
    </div>
  );
};
export default Navbar;
