import axios from "axios";

interface LatLng {
  lat: number;
  lng: number;
}

interface ShapesState {
  circles: { center: LatLng; radius: number }[];
  polygons: LatLng[][];
  polylines: LatLng[][];
  rectangles: LatLng[][];
}

type SetShapes = React.Dispatch<React.SetStateAction<ShapesState>>;

export const handleDeleteCircle = async (
  center: LatLng,
  radius: number,
  email: string,
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
      setShapes((prevShapes) => ({
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
  coords: LatLng[][],
  setShapes: SetShapes,
  shapes: ShapesState,
  email: string
) => {
  const compareCoordinates = (coord1: any, coord2: LatLng) => {
    console.log(coord1, coord2);
    const match = coord1.find((item: any) => item === coord2);
    return match;
  };

  const polygonExists = shapes.polygons.some((polygon) => {
    return polygon.every((point, index) => {
      return compareCoordinates(point, coords[0][index]);
    });
  });

  if (!polygonExists) {
    console.error("No matching polygon found for deletion.");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:3001/api/v1/polygons/deleteSinglePolygon",
      {
        email,
        coords,
      }
    );

    if (response.status === 200) {
      console.log("Polygon deleted successfully:", response.data.message);
      setShapes((prevShapes) => ({
        ...prevShapes,
        polygons: prevShapes.polygons.filter((polygon) => {
          return !polygon.every((point, index) => {
            return compareCoordinates(point, coords[0][index]);
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
  coords: LatLng[],
  email: string,
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
      setShapes((prevShapes) => ({
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
  bounds: LatLng[],
  email: string,
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
      setShapes((prevShapes) => ({
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
