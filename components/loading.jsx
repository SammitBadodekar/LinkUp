import { HashLoader } from "react-spinners";
import "./loading.css";

const loading = () => {
  return (
    <div className="bg-white dark:bg-darkTheme w-screen h-screen flex justify-center items-center">
      <span className="loader"></span>
    </div>
  );
};
export default loading;
