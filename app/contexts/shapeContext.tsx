import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import L, { LatLng, LatLngBounds, LatLngExpression } from "leaflet";
import { useSession } from "next-auth/react";

export type ShapesState = {
  polygons: LatLngExpression[][];
  circles: { center: LatLng; radius: number }[];
  polylines: LatLngExpression[][];
  rectangles: LatLngBounds[];
};

const initialShapes: ShapesState = {
  polygons: [],
  circles: [],
  polylines: [],
  rectangles: [],
};

interface ShapeContextType {
  shapes: ShapesState;
  setShapes: React.Dispatch<React.SetStateAction<ShapesState>>;
  fetchShapes: () => Promise<void>;
  loading: boolean; // Loading state
  error: string | null; // Error state
}

const ShapeContext = createContext<ShapeContextType | undefined>(undefined);

export const ShapeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data } = useSession();
  const email = data?.user?.email;
  const [shapes, setShapes] = useState<ShapesState>(initialShapes);
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const fetchShapes = async () => {
    if (!email) return; // Exit if email is not available
    setLoading(true);
    setError(null); // Reset error state before fetching
    try {
      const [
        rectanglesResponse,
        polylinesResponse,
        circlesResponse,
        polygonsResponse,
      ] = await Promise.all([
        axios.post("http://localhost:3001/api/v1/rectangles/getRectangle", {
          email,
        }),
        axios.post("http://localhost:3001/api/v1/line/getLine", { email }),
        axios.post("http://localhost:3001/api/v1/circle/getCircle", {
          email,
        }),
        axios.post("http://localhost:3001/api/v1/polygons/getPolygon", {
          email,
        }),
      ]);

      const rectangles = rectanglesResponse.data.map((rect: any) =>
        L.latLngBounds(
          [rect.bounds.southwest.lat, rect.bounds.southwest.lng],
          [rect.bounds.northeast.lat, rect.bounds.northeast.lng]
        )
      );

      const polylines = polylinesResponse.data.map(
        (polyline: any) => polyline.coords
      );
      const circles = circlesResponse.data.map((circle: any) => ({
        center: { lat: circle.center.lat, lng: circle.center.lng },
        radius: circle.radius,
      }));
      const polygons = polygonsResponse.data.map(
        (polygon: any) => polygon.coords
      );

      setShapes({
        rectangles,
        polylines,
        circles,
        polygons,
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error fetching shapes"
      );
      console.error("Error fetching shapes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch shapes when the session changes
  useEffect(() => {
    fetchShapes();
  }, [email]);

  return (
    <ShapeContext.Provider
      value={{ shapes, setShapes, fetchShapes, loading, error }}
    >
      {children}
    </ShapeContext.Provider>
  );
};

export const useShapes = () => {
  const context = useContext(ShapeContext);
  if (!context) {
    throw new Error("useShapes must be used within a ShapeProvider");
  }
  return context;
};
