import { motion } from "framer-motion";

const PageTransition = () => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: "-150%" }}
      transition={{
        duration: 0.75,
        delay: 0.5,
      }}
      className=" absolute top-0 z-40 grid h-screen w-screen gap-8 bg-slate-300 dark:bg-slate-700 dark:text-slate-300"
    >
      <motion.p
        initial={{ x: "20%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 2.25,
        }}
        className=" text-9xl font-bold"
      >
        linkUp
      </motion.p>
      <motion.p
        initial={{ x: "20%" }}
        animate={{ x: "0" }}
        transition={{
          duration: 1.25,
        }}
        className=" text-9xl font-bold"
      >
        linkUp
      </motion.p>
      <motion.p
        initial={{ x: "20%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 2.25,
        }}
        className=" text-9xl font-bold"
      >
        linkUp
      </motion.p>
    </motion.div>
  );
};
export default PageTransition;
