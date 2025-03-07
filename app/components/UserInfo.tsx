import React, { useState } from "react";
import { useUser } from "../contexts/LoginContext";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { BsThreeDots } from "react-icons/bs";

const UserProfile = () => {
  const { email, photoUrl, name } = useUser();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
      {photoUrl && (
        <Image
          src={photoUrl}
          alt="User Profile"
          width={64}
          height={64}
          className="w-16 h-16 rounded-full mx-auto mb-4"
        />
      )}

      <div className="flex justify-between items-center">
        <div className="text-left">
          <p className="text-lg font-semibold">{name}</p>
          <p className="text-sm text-gray-600">{email}</p>
        </div>

        <button
          onClick={() => setShowLogout(!showLogout)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <BsThreeDots className="text-gray-600" />
        </button>
      </div>

      {showLogout && (
        <button
          onClick={() => signOut()}
          className="w-full mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default UserProfile;
