import React, { useState } from "react";
import { useUser } from "../contexts/LoginContext";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { BsThreeDots } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const UserProfile = () => {
  const { email, photoUrl, name } = useUser();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <Card className="p-6 mt-6">
      {photoUrl && (
        <div className="flex justify-center">
          <Image
            src={photoUrl}
            alt="User Profile"
            width={64}
            height={64}
            className="w-16 h-16 rounded-full mb-4 object-cover border-2 border-primary/20"
          />
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="text-left">
          <p className="text-lg font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>

        <button
          onClick={() => setShowLogout(!showLogout)}
          className="p-2 hover:bg-muted rounded-full transition-colors"
          aria-label="User options"
        >
          <BsThreeDots className="text-muted-foreground" />
        </button>
      </div>

      {showLogout && (
        <Button
          onClick={() => signOut()}
          className="w-full mt-4"
          variant="destructive"
        >
          Logout
        </Button>
      )}
    </Card>
  );
};

export default UserProfile;