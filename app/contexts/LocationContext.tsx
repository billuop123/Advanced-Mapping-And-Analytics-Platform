import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "./LoginContext";

// Define the interface for the location object
interface Location {
  latitude: number;
  longitude: number;
  description: string;
  type: string;
}

// Define the shape of the context
interface LocationContextType {
  allLocationArray: Location[];
  addLocation: (location: Location) => void;
  fetchMarkers: (email: string) => Promise<void>; // Add a function to fetch markers
  loading: boolean; // Add a loading state
  error: string | null; // Add an error state
  setAllLocationArray: React.Dispatch<React.SetStateAction<Location[]>>;
}

// Create the context
const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

// Custom hook to use the context
export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error(
      "useLocationContext must be used within a LocationProvider"
    );
  }
  return context;
};

// Context Provider component
export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { email } = useUser();

  const [allLocationArray, setAllLocationArray] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Function to add a new location
  const addLocation = (location: Location) => {
    setAllLocationArray((prev) => [...prev, location]);
  };

  const fetchMarkers = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/v1/marker/getMarker", { email });
      if (response.status === 200) {
        setAllLocationArray(response.data.markers); // Update the state with fetched markers
      } else {
        throw new Error("Failed to fetch markers");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Optionally, you can fetch markers when the component mounts
  useEffect(() => {
    if (!email) return;
    // Replace with the actual email or get it from somewhere
    fetchMarkers(email);
  }, [email]);

  return (
    <LocationContext.Provider
      value={{
        allLocationArray,
        addLocation,
        fetchMarkers,
        setAllLocationArray,
        loading,
        error,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
