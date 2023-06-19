"use client";
import { UserContext } from "@/context/userContext";
import { useContext } from "react";
import Image from "next/image";

const Navbar = () => {
  const [user, setuser] = useContext(UserContext);
  return (
    <div
      className={`shadow-lg p-2 flex justify-between px-4 ${
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
      />
    </div>
  );
};
export default Navbar;
