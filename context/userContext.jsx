"use client";
import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState(null);
  const [active, setActive] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileModalText, setProfileModalText] = useState([]);
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
        allUsers,
        setAllUsers,
        isModalOpen,
        setIsModalOpen,
        profileModalText,
        setProfileModalText,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
