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
  fetchMarkers: (email: string) => Promise<void>; // Function to fetch markers
  loading: boolean; // Loading state
  error: string | null; // Error state
  setAllLocationArray: React.Dispatch<React.SetStateAction<Location[]>>;
}

// Create the context with a default value
const LocationContext = createContext<LocationContextType>({
  allLocationArray: [],
  addLocation: () => {},
  fetchMarkers: async () => {},
  setAllLocationArray: () => {},
  loading: false,
  error: null,
});

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

  // Function to fetch markers
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
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching markers"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch markers when the component mounts or when the email changes
  useEffect(() => {
    if (email) {
      fetchMarkers(email);
    }
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
