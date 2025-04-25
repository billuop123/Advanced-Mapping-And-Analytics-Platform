import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "./LoginContext";


interface Location {
  latitude: number;
  longitude: number;
  description: string;
  type: string;
}


interface LocationContextType {
  allLocationArray: Location[];
  addLocation: (location: Location) => void;
  fetchMarkers: (email: string) => Promise<void>; 
  loading: boolean; 
  error: string | null; 
  setAllLocationArray: React.Dispatch<React.SetStateAction<Location[]>>;
}


const LocationContext = createContext<LocationContextType>({
  allLocationArray: [],
  addLocation: () => {},
  fetchMarkers: async () => {},
  setAllLocationArray: () => {},
  loading: false,
  error: null,
});


export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error(
      "useLocationContext must be used within a LocationProvider"
    );
  }
  return context;
};


export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { email } = useUser();

  const [allLocationArray, setAllLocationArray] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state


  const addLocation = (location: Location) => {
    setAllLocationArray((prev) => [...prev, location]);
  };


  const fetchMarkers = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/v1/marker/getMarker?email=${email}`);
      if (response.status === 200) {
        setAllLocationArray(response.data.markers);
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
