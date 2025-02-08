// shapeActions.ts
import axios from "axios";
import L, { LatLngExpression } from "leaflet";

export const _created = async (
  e: { layer: L.Layer },
  email: string | undefined,
  setShapes: React.Dispatch<React.SetStateAction<any>>
) => {
  const layer = e.layer;

  if (layer instanceof L.Rectangle) {
    const bounds = layer.getBounds();
    try {
      await axios.post(
        "http://localhost:3001/api/v1/rectangles/createRectangle",
        {
          email,
          bounds: {
            southwest: {
              lat: bounds.getSouthWest().lat,
              lng: bounds.getSouthWest().lng,
            },
            northeast: {
              lat: bounds.getNorthEast().lat,
              lng: bounds.getNorthEast().lng,
            },
          },
          type: "RECTANGLE",
        }
      );
      setShapes((prevShapes) => ({
        ...prevShapes,
        rectangles: [...prevShapes.rectangles, bounds],
      }));
    } catch (error) {
      console.error("Error saving rectangle:", error);
    }
  } else if (layer instanceof L.Polygon) {
    const coords = layer.getLatLngs() as LatLngExpression[];
    try {
      await axios.post("http://localhost:3001/api/v1/polygons/createPolygon", {
        email,
        coords: coords,
        type: "POLYGON",
      });
      setShapes((prevShapes) => ({
        ...prevShapes,
        polygons: [...prevShapes.polygons, coords],
      }));
    } catch (error) {
      console.error("Error saving polygon:", error);
    }
  } else if (layer instanceof L.Circle) {
    const center = layer.getLatLng();
    const radius = layer.getRadius();
    try {
      await axios.post("http://localhost:3001/api/v1/circle/createCircle", {
        email,
        center: center,
        radius: radius,
        type: "CIRCLE",
      });
      setShapes((prevShapes) => ({
        ...prevShapes,
        circles: [...prevShapes.circles, { center, radius }],
      }));
    } catch (error) {
      console.error("Error saving circle:", error);
    }
  } else if (layer instanceof L.Polyline) {
    const coords = layer.getLatLngs() as LatLngExpression[];
    try {
      await axios.post("http://localhost:3001/api/v1/line/createLine", {
        email,
        coords: coords,
        type: "POLYLINE",
      });
      setShapes((prevShapes) => ({
        ...prevShapes,
        polylines: [...prevShapes.polylines, coords],
      }));
    } catch (error) {
      console.error("Error saving polyline:", error);
    }
  }
};
