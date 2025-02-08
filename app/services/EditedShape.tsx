import { debounce } from "lodash";
import { useRef } from "react";
import L, { LatLngExpression } from "leaflet";
import axios from "axios";
import { useUser } from "../contexts/LoginContext";

const _editedDebounced = debounce(
  async (
    e: { layers: L.LayerGroup },
    isEditing: React.MutableRefObject<boolean>,
    mapRef: React.MutableRefObject<L.Map | null>,
    email: string | undefined
  ) => {
    console.log("_editedDebounced function triggered");

    if (isEditing.current) {
      console.log(
        "Editing prevented by isEditing.current =",
        isEditing.current
      );
      return;
    }

    console.log("Setting isEditing.current to true");
    isEditing.current = true;

    try {
      const allLayers: L.Layer[] = [];
      mapRef.current?.eachLayer((layer) => {
        if (
          layer instanceof L.Rectangle ||
          layer instanceof L.Polygon ||
          layer instanceof L.Circle ||
          layer instanceof L.Polyline
        ) {
          allLayers.push(layer);
        }
      });

      const shapesToCreate: any[] = [];

      for (const layer of allLayers) {
        console.log("Processing layer:", layer);

        if (layer instanceof L.Rectangle) {
          const bounds = layer.getBounds();
          shapesToCreate.push({
            type: "RECTANGLE",
            data: {
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
            },
          });
        } else if (layer instanceof L.Polygon) {
          const coords = layer.getLatLngs() as LatLngExpression[];
          shapesToCreate.push({
            type: "POLYGON",
            data: { coords },
          });
        } else if (layer instanceof L.Circle) {
          const center = layer.getLatLng();
          const radius = layer.getRadius();
          shapesToCreate.push({
            type: "CIRCLE",
            data: { center: { lat: center.lat, lng: center.lng }, radius },
          });
        } else if (layer instanceof L.Polyline) {
          const coords = layer.getLatLngs() as LatLngExpression[];
          shapesToCreate.push({
            type: "POLYLINE",
            data: { coords },
          });
        }
      }

      if (email) {
        await axios.delete(
          "http://localhost:3001/api/v1/shapes/deleteAllShapes",
          {
            data: { email },
          }
        );
        console.log("All existing shapes deleted successfully");

        if (shapesToCreate.length > 0) {
          await axios.post(
            "http://localhost:3001/api/v1/shapes/batchCreateShapes",
            {
              email,
              shapes: shapesToCreate,
            }
          );
          console.log("Shapes created successfully:", shapesToCreate);
        }
      }
    } catch (error) {
      console.error("Error during editing:", error);
    } finally {
      console.log("Resetting isEditing.current to false");
      isEditing.current = false;
    }
  },
  300
);

export const useEditedDebounced = (
  mapRef: React.MutableRefObject<L.Map | null>
) => {
  const isEditing = useRef(false);
  const { email } = useUser();

  return (e: { layers: L.LayerGroup }) => {
    _editedDebounced(e, isEditing, mapRef, email);
  };
};
