"use client";
import { SessionProvider } from "next-auth/react";

const authProvider = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
export default authProvider;
