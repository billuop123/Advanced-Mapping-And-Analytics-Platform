// contexts/UserContext.tsx
import React, { createContext, useContext } from "react";
import { useSession } from "next-auth/react";

interface UserContextType {
  email: string | undefined;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data } = useSession();
  const email = data?.user?.email;

  return (
    <UserContext.Provider value={{ email }}>{children}</UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser  must be used within a UserProvider");
  }
  return context;
};
