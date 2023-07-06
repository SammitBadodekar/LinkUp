"use client";
import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  return (
    <UserContext.Provider value={{ user, setUser, requests, setRequests }}>
      {children}
    </UserContext.Provider>
  );
};
