"use client";
import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState(null);
  const [active, setActive] = useState(null);
  const [addNewChats, setAddNewChats] = useState(false);
  const [allUsers, setAllUsers] = useState(null);
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        requests,
        setRequests,
        friends,
        setFriends,
        active,
        setActive,
        addNewChats,
        setAddNewChats,
        allUsers,
        setAllUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
