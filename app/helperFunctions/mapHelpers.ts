import axios from "axios";
import { LatLng, LatLngBounds, LatLngExpression } from "leaflet";

interface ShapesState {
  circles: { center: LatLng; radius: number }[];
  polygons: LatLng[][];
  polylines: LatLng[][];
  rectangles: LatLng[][];
}

type SetShapes = React.Dispatch<React.SetStateAction<ShapesState>>;

export const handleDeleteCircle = async (
  center: LatLngExpression,
  radius: number,
  email: string | null | undefined,
  setShapes: SetShapes
) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/api/v1/circle/deleteSingleCircle",
      {
        email,
        center,
        radius,
      }
    );

    if (response.status === 200) {
      console.log("Circle deleted successfully:", response.data.message);
      setShapes((prevShapes: ShapesState) => ({
        ...prevShapes,
        circles: prevShapes.circles.filter(
          (circle) =>
            circle.center.lat !== center.lat ||
            circle.center.lng !== center.lng ||
            circle.radius !== radius
        ),
      }));
    } else {
      console.error("Failed to delete circle:", response.data.error);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error deleting circle:",
        error.response?.data?.error || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
  }
};

export const handleDeletePolygon = async (
  coords:
    | LatLngExpression[]
    | { lat: number; lng: number }[]
    | LatLng[][]
    | { lat: number; lng: number }[][],
  setShapes: SetShapes,
  shapes: ShapesState,
  email: string | null | undefined
) => {
  console.log("Original coords:", coords);

  let normalizedCoords: { lat: number; lng: number }[];

  if (
    Array.isArray(coords[0]) &&
    (coords[0] instanceof LatLng || typeof coords[0][0] === "object")
  ) {
    normalizedCoords = (coords as (LatLng | { lat: number; lng: number })[])
      .flat()
      .map((point) =>
        point instanceof LatLng
          ? { lat: point.lat, lng: point.lng }
          : { lat: point.lat, lng: point.lng }
      );
  } else {
    normalizedCoords = (
      coords as (LatLng | { lat: number; lng: number })[]
    ).map((point) =>
      point instanceof LatLng
        ? { lat: point.lat, lng: point.lng }
        : { lat: point.lat, lng: point.lng }
    );
  }

  console.log("Normalized coords:", normalizedCoords);

  const compareCoordinates = (
    coord1: { lat: number; lng: number },
    coord2: { lat: number; lng: number }
  ) => {
    console.log("Comparing:", coord1, coord2);
    return coord1.lat === coord2.lat && coord1.lng === coord2.lng;
  };

  const polygonExists = shapes.polygons.some((polygon) => {
    return polygon.every((point, index) => {
      return compareCoordinates(point, normalizedCoords[index]);
    });
  });
  console.log(polygonExists);
  if (!polygonExists) {
    console.error("No matching polygon found for deletion.");
    return;
  }

  try {
    // Send a request to delete the polygon
    const response = await axios.post(
      "http://localhost:3001/api/v1/polygons/deleteSinglePolygon",
      {
        email,
        coords: normalizedCoords, // Use normalized coordinates
      }
    );

    if (response.status === 200) {
      console.log("Polygon deleted successfully:", response.data.message);

      // Update the state by removing the deleted polygon
      setShapes((prevShapes: ShapesState) => ({
        ...prevShapes,
        polygons: prevShapes.polygons.filter((polygon) => {
          return !polygon.every((point, index) => {
            return compareCoordinates(point, normalizedCoords[index]);
          });
        }),
      }));
    } else {
      console.error("Failed to delete polygon:", response.data.error);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error deleting polygon:",
        error.response?.data?.error || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
  }
};
export const handleDeleteLine = async (
  coords: LatLngExpression[],
  email: string | null | undefined,
  setShapes: SetShapes
) => {
  console.log(coords); // Log the coordinates for debugging

  try {
    const response = await axios.post(
      "http://localhost:3001/api/v1/line/deleteSingleLine",
      { email, coords }
    );

    if (response.status === 200) {
      console.log("Polyline deleted successfully:", response.data.message);
      setShapes((prevShapes: ShapesState) => ({
        ...prevShapes,
        polylines: prevShapes.polylines.filter(
          (line) => JSON.stringify(line) !== JSON.stringify(coords)
        ),
      }));
    } else {
      console.error("Failed to delete polyline:", response.data.error);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error deleting polyline:",
        error.response?.data?.error || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
  }
};

export const handleDeleteRectangle = async (
  bounds: LatLngBounds,
  email: string | null | undefined,
  setShapes: SetShapes
) => {
  console.log(bounds);

  try {
    const response = await axios.post(
      "http://localhost:3001/api/v1/rectangles/deleteSingleRectangle",
      { email, bounds }
    );

    if (response.status === 200) {
      console.log("Rectangle deleted successfully:", response.data.message);
      setShapes((prevShapes: ShapesState) => ({
        ...prevShapes,
        rectangles: prevShapes.rectangles.filter(
          (rectangle) => JSON.stringify(rectangle) !== JSON.stringify(bounds)
        ),
      }));
    } else {
      console.error("Failed to delete rectangle:", response.data.error);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Failed to delete rectangle:", error.response?.data?.error);
    } else {
      console.error("Unexpected error:", error);
    }
  }
};
