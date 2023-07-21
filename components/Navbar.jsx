"use client";
import { useState, useRef, useEffect, useContext } from "react";
import Image from "next/image";
import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import Profile from "./profile";
import { useTheme } from "next-themes";

const Navbar = (props) => {
  const { user } = props;
  const [isClicked, setIsClicked] = useState(false);
  const { theme, setTheme } = useTheme();
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
        src={user?.image || "/PngItem_307416.png"}
        width={50}
        height={50}
        alt="profile"
        className=" cursor-pointer rounded-full object-cover"
        onClick={() => setIsClicked(!isClicked)}
      />

      <div className=" flex items-center gap-2 text-xl  text-slate-500 dark:text-slate-200">
        <div
          className="relative  flex gap-4 rounded-full bg-slate-300 p-2 text-sm text-darkTheme dark:bg-slate-600 dark:text-slate-300"
          onClick={() => {
            if (theme === "dark") {
              setTheme("light");
            } else setTheme("dark");
          }}
        >
          <button>
            <BsFillSunFill />
          </button>
          <button>
            <BsFillMoonStarsFill />
          </button>
          <div
            className={`absolute top-1 h-6 w-6 rounded-full bg-blue-950 duration-300 ease-out dark:bg-yellow-300 ${
              theme === "dark" ? " translate-x-6" : " -translate-x-1"
            }`}
          ></div>
        </div>
      </div>

      <div ref={modalRef} className=" fixed z-50 flex justify-center">
        <Profile user={user} open={isClicked} setOpen={setIsClicked} />
      </div>
    </div>
  );
};
export default Navbar;
