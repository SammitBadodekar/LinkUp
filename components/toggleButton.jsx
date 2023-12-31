import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import { useTheme } from "next-themes";

const ToggleButton = () => {
  const { theme, setTheme } = useTheme();
  return (
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
  );
};
export default ToggleButton;
