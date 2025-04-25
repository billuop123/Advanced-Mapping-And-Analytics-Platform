import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./LoginContext";

interface RoleContextType {
  role: string;
  fetchRole: () => Promise<void>; 
}

const RoleContext = createContext<RoleContextType>({
  role: "",
  fetchRole: async () => {},
});

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { email } = useUser();
  const [role, setRole] = useState("");

  const fetchRole = async () => {
    if (!email) return;
    try {
      const response = await axios.post(
        "http://localhost:3001/api/v1/user/role",
        { email }
      );
      setRole(response.data.role.role);
    } catch (err) {
      console.error("Error fetching role:", err);
    }
  };


  useEffect(() => {
    if (email) {
      fetchRole();
    }
  }, [email, fetchRole]);

  return (
    <RoleContext.Provider value={{ role, fetchRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};
