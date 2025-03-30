import axios from "axios";
import L, { LatLng, LatLngBounds, LatLngExpression } from "leaflet";

type ShapesState = {
  polygons: LatLngExpression[][];
  circles: { center: LatLng; radius: number }[];
  polylines: LatLngExpression[][];
  rectangles: LatLngBounds[];
};
export const _created = async (
  e: { layer: L.Layer },
  email: string | null | undefined,
  setShapes: React.Dispatch<React.SetStateAction<any>>,

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
      setShapes((prevShapes: ShapesState) => ({
        ...prevShapes,
        rectangles: [...prevShapes.rectangles, bounds],
      }));
    } catch (error) {
      console.error("Error saving rectangle:", error);
    }
  } else if (layer instanceof L.Polygon) {
    const coords = layer.getLatLngs() as LatLngExpression[];
    console.log(coords);
    try {
      await axios.post("http://localhost:3001/api/v1/polygons/createPolygon", {
        email,
        coords: coords,
        type: "POLYGON",
      });
      setShapes((prevShapes: ShapesState) => ({
        ...prevShapes,
        polygons: [...prevShapes.polygons, ...coords],
      }));
    } catch (error) {
      console.error("Error saving polygon:", error);
    }
  } else if (layer instanceof L.Circle) {
    const center = layer.getLatLng();
    const radius = layer.getRadius();
    try {
      await axios.post("http://localhost:3001/api/v1/circle/createCircle", {
        center: center,
        radius: radius,
        type: "CIRCLE",
      });
      setShapes((prevShapes: ShapesState) => ({
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
      setShapes((prevShapes: ShapesState) => ({
        ...prevShapes,
        polylines: [...prevShapes.polylines, coords],
      }));
    } catch (error) {
      console.error("Error saving polyline:", error);
    }
  } else if (layer instanceof L.Marker) {
    // Attach a popup to the marker
    const marker = layer;
    marker.bindPopup("This is a custom popup for the marker").openPopup();

    // Save the marker to the state (if needed)
  }
};
