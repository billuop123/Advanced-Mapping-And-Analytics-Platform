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

const ShapeContext = createContext<{
  shapes: ShapesState;
  setShapes: React.Dispatch<React.SetStateAction<ShapesState>>;
} | null>(null);

export const ShapeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data } = useSession();
  const email = data?.user?.email;
  const [shapes, setShapes] = useState<ShapesState>(initialShapes);

  // Fetch shapes from the backend
  useEffect(() => {
    const fetchShapes = async () => {
      if (email) {
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
          console.error("Error fetching shapes:", error);
        }
      }
    };

    fetchShapes();
  }, [email]);

  // Updated shapesAreEqual function

  return (
    <ShapeContext.Provider value={{ shapes, setShapes }}>
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
