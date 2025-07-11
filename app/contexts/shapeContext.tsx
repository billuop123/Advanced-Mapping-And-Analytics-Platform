import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import L, { LatLng, LatLngBounds, LatLngExpression } from "leaflet";
import { useSession } from "next-auth/react";
import { ShapesState } from "@/src/domain/entities/Map";
import { API_ENDPOINTS } from "@/src/config/api";



const initialShapes: ShapesState   = {
  polygons: [],
  circles: [],
  polylines: [],
  rectangles: [],
};

interface ShapeContextType {
  shapes: ShapesState;
  setShapes: React.Dispatch<React.SetStateAction<ShapesState>>;
  fetchShapes: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ShapeContext = createContext<ShapeContextType | undefined>(undefined);

export const ShapeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data } = useSession();
  const email = data?.user?.email;
  const [shapes, setShapes] = useState<ShapesState>(initialShapes);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

   const fetchShapes = async () => {
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const [rectanglesResponse, linesResponse, circlesResponse, polygonsResponse] = await Promise.all([
        axios.get(`${API_ENDPOINTS.RECTANGLES.GET_ALL}`),
        axios.get(`${API_ENDPOINTS.LINES.GET_ALL}`),
        axios.get(`${API_ENDPOINTS.CIRCLES.GET_ALL}`),
        axios.get(`${API_ENDPOINTS.POLYGONS.GET_ALL}`)
      ]);

      const rectangles = rectanglesResponse.data.map((rect: any) =>
        L.latLngBounds(
          [rect.bounds.southwest.lat, rect.bounds.southwest.lng],
          [rect.bounds.northeast.lat, rect.bounds.northeast.lng]
        )
      );

      const polylines = linesResponse.data.map(
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
