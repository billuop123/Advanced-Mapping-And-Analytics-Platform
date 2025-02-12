import React, { useState } from "react";
import { useLocationContext } from "../contexts/LocationContext";
import { usePosition } from "../contexts/PositionContext";
import axios from "axios";
import { FaWindowMinimize } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import UserInfo from "./UserInfo"; // Import UserInfo
import { useUser } from "../contexts/LoginContext";

const Dashboard = () => {
  const [type, setType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const { addLocation } = useLocationContext();
  const { setPosition, position } = usePosition();
  const [showDashboard, setShowDashboard] = useState<boolean>(true); // Toggle dashboard visibility
  const { email } = useUser();
  console.log(email);
  const typeOptions = [
    { id: 1, name: "Hospital" },
    { id: 2, name: "Temple" },
    { id: 3, name: "School" },
    { id: 4, name: "Mall" },
    { id: 5, name: "Park" },
    { id: 6, name: "Others" },
  ];
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newLocation = {
      latitude: parseFloat(position[0].toFixed(14)),
      longitude: parseFloat(position[1].toFixed(14)),
      type: type || "Others",
      description,
    };

    try {
      await axios.post("http://localhost:3001/api/v1/marker/createMarker", {
        newLocation,
        email,
      });
      addLocation(newLocation);
    } catch (error) {
      console.error("Error creating marker:", error);
      // Handle error (e.g., show a notification to the user)
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        {/* Toggle Dashboard Visibility */}
        <button
          onClick={() => setShowDashboard(!showDashboard)}
          className="w-full flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        >
          {showDashboard ? (
            <FaWindowMinimize className="text-lg" />
          ) : (
            <IoMdAdd className="text-lg" />
          )}
        </button>

        {showDashboard && (
          <>
            <h1 className="text-2xl font-bold text-blue-800 text-center mb-4">
              Location Dashboard
            </h1>

            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Latitude Input */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  value={position[0]}
                  onChange={(e) =>
                    setPosition([Number(e.target.value), position[1]])
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter latitude"
                  required
                />
              </div>

              {/* Longitude Input */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  value={position[1]}
                  onChange={(e) =>
                    setPosition([position[0], Number(e.target.value)])
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter longitude"
                  required
                />
              </div>

              {/* Type Select */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>
                    Select a type
                  </option>
                  {typeOptions.map((option) => (
                    <option key={option.id} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description Textarea */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description"
                  rows={3}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </form>

            {/* User Info Section */}
            <div className="mt-4">
              <UserInfo />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
