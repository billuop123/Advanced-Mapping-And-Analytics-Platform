import { API_ENDPOINTS } from "@/src/config/api";
import { ShapesState } from "@/src/domain/entities/Map";
import axios from "axios";
import L, {
   LatLngExpression } from "leaflet";

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
        `${API_ENDPOINTS.RECTANGLES.CREATE}`,
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
      await axios.post(`${API_ENDPOINTS.POLYGONS.CREATE}`, {
        coords: coords,
        type: "POLYGON",
      });
      setShapes((prevShapes: ShapesState) => ({
        ...prevShapes,
        polygons: [...prevShapes.polygons, ...coords],
      }));
    } catch (error:any) {
      console.error("Error saving polygon:", error.message);
    }
  } else if (layer instanceof L.Circle) {
    const center = layer.getLatLng();
    const radius = layer.getRadius();
    try {
      await axios.post(`${API_ENDPOINTS.CIRCLES.CREATE}`, {
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
      await axios.post(`${API_ENDPOINTS.LINES.CREATE}`, {
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
   
    const marker = layer;
    marker.bindPopup("This is a custom popup for the marker").openPopup();
  }
};
