// contexts/UserContext.tsx
import React, { createContext, useContext } from "react";
import { useSession } from "next-auth/react";

interface UserContextType {
  email: string | undefined | null;
  photoUrl: string | undefined | null;
  name: string | undefined | null;
  status: string | undefined | null;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data, status } = useSession();
  const email = data?.user?.email;
  const photoUrl = data?.user?.image;
  const name = data?.user?.name;
  return (
    <UserContext.Provider value={{ email, photoUrl, name, status }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser  must be used within a UserProvider");
  }
  return context;
};
