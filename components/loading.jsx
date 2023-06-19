import { HashLoader } from "react-spinners";
import logo from "../public/imgs/li_nkup-removebg-preview.png";

const loading = () => {
  return (
    <div className=" dark:bg-darkTheme flex justify-center items-center w-screen h-screen">
      <img src={logo} alt="" />
    </div>
  );
};
export default loading;
