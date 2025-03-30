"use client";
import axios from "axios";
import L from "leaflet";
import { debounce } from "lodash";
import { useRef } from "react";
import { useUser } from "../contexts/LoginContext";
import { useShapes } from "../contexts/shapeContext";

const _editedDebounced = debounce(
  async (
    e: { layers: L.LayerGroup },
    isEditing: React.MutableRefObject<boolean>,
    mapRef: React.MutableRefObject<L.Map | null>,
    email: string | null | undefined,
    setShapes
  ) => {
    if (isEditing.current) {
      console.log(
        "Editing prevented by isEditing.current =",
        isEditing.current
      );
      return;
    }

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

      // Store the initial state of all layers and their popup content
      const initialLayerStates = allLayers.map((layer) => {
        const popup = layer.getPopup();
        const popupContent = popup ? popup.getContent() : null;

        if (layer instanceof L.Rectangle) {
          const bounds = layer.getBounds();
          return {
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
            popupContent,
          };
        } else if (layer instanceof L.Polygon) {
          const coords = layer.getLatLngs();
          return {
            type: "POLYGON",
            data: { coords: coords.flat() },
            popupContent,
          };
        } else if (layer instanceof L.Circle) {
          const center = layer.getLatLng();
          const radius = layer.getRadius();
          return {
            type: "CIRCLE",
            data: { center: { lat: center.lat, lng: center.lng }, radius },
            popupContent,
          };
        } else if (layer instanceof L.Polyline) {
          const coords = layer.getLatLngs();
          return {
            type: "POLYLINE",
            data: { coords: coords.flat() },
            popupContent,
          };
        }
        return null;
      });

      // Get the edited layers from the event
      const editedLayers = e.layers.getLayers();

      // Create a set of edited layer IDs for easier comparison
      const editedLayerIds = new Set(
        //@ts-expect-error
        editedLayers.map((layer) => layer._leaflet_id)
      );

      const shapesToCreate: any[] = [];

      for (const layer of allLayers) {
        console.log("Processing layer:", layer);

        // Capture the new state of edited
        //@ts-expect-error
        if (editedLayerIds.has(layer._leaflet_id)) {
          const initialState = initialLayerStates.find(
            (state) => state && state.type === layer.constructor.name
          );

          if (layer instanceof L.Rectangle) {
            const bounds = layer.getBounds();
            const newShape = {
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
            };

            // Log the edited shape and its initial state
            console.log("Edited Rectangle:", newShape);
            console.log("Initial State:", initialState);

            shapesToCreate.push(newShape);
          } else if (layer instanceof L.Polygon) {
            const coords = layer.getLatLngs();
            const newShape = {
              type: "POLYGON",
              data: { coords: coords.flat() },
            };

            // Log the edited shape and its initial state
            console.log("Edited Polygon:", newShape);
            console.log("Initial State:", initialState);

            shapesToCreate.push(newShape);
          } else if (layer instanceof L.Circle) {
            const center = layer.getLatLng();
            const radius = layer.getRadius();
            const newShape = {
              type: "CIRCLE",
              data: { center: { lat: center.lat, lng: center.lng }, radius },
            };

            // Log the edited shape and its initial state
            console.log("Edited Circle:", newShape);
            console.log("Initial State:", initialState);

            shapesToCreate.push(newShape);
          } else if (layer instanceof L.Polyline) {
            const coords = layer.getLatLngs();
            const newShape = {
              type: "POLYLINE",
              data: { coords: coords.flat() },
            };

            // Log the edited shape and its initial state
            console.log("Edited Polyline:", newShape);
            console.log("Initial State:", initialState);

            shapesToCreate.push(newShape);
          }
        } else {
          // Only process layers that are not edited
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
            const coords = layer.getLatLngs();
            shapesToCreate.push({
              type: "POLYGON",
              data: { coords: coords.flat() },
            });
          } else if (layer instanceof L.Circle) {
            const center = layer.getLatLng();
            const radius = layer.getRadius();
            shapesToCreate.push({
              type: "CIRCLE",
              data: { center: { lat: center.lat, lng: center.lng }, radius },
            });
          } else if (layer instanceof L.Polyline) {
            const coords = layer.getLatLngs();
            shapesToCreate.push({
              type: "POLYLINE",
              data: { coords: coords.flat() },
            });
          }
        }
      }

      console.log("Shapes to Create:", shapesToCreate);
      const newShapes = {
        polygons: shapesToCreate

          .filter((shape) => shape.type === "POLYGON")

          .map((shape) => shape.data.coords),

        circles: shapesToCreate

          .filter((shape) => shape.type === "CIRCLE")

          .map((shape) => ({
            center: { lat: shape.data.center.lat, lng: shape.data.center.lng },

            radius: shape.data.radius,
          })),

        polylines: shapesToCreate

          .filter((shape) => shape.type === "POLYLINE")

          .map((shape) => shape.data.coords),

        rectangles: shapesToCreate

          .filter((shape) => shape.type === "RECTANGLE")

          .map((shape) =>
            L.latLngBounds(
              [
                shape.data.bounds.southwest.lat,

                shape.data.bounds.southwest.lng,
              ],

              [shape.data.bounds.northeast.lat, shape.data.bounds.northeast.lng]
            )
          ),
      };

      setShapes(newShapes);

      if (email) {
        // Delete all existing shapes
        const deleteResponse = await axios.delete(
          "http://localhost:3001/api/v1/shapes/deleteAllShapes",
          {
            data: { email },
          }
        );
        console.log("Delete Response:", deleteResponse.data);

        // Check if deletion was successful
        if (deleteResponse.status === 200) {
          // Save the new shapes (including the edited ones)
          if (shapesToCreate.length > 0) {
            const createResponse = await axios.post(
              "http://localhost:3001/api/v1/shapes/batchCreateShapes",
              {
                email,
                shapes: shapesToCreate,
              }
            );
            console.log("Create Response:", createResponse.data);
          } else {
            console.log("No shapes to create after deletion.");
          }
        } else {
          console.error("Failed to delete shapes:", deleteResponse.data);
        }
      }

      // Reattach popup content to edited layers
      for (const layer of allLayers) {
//@ts-expect-error
        if (editedLayerIds.has(layer._leaflet_id)) {
          const initialState = initialLayerStates.find(
            (state) => state && state.type === layer.constructor.name
          );

          if (initialState && initialState.popupContent) {
            layer.bindPopup(initialState.popupContent).openPopup();
          }
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
  const { setShapes } = useShapes();
  return (e: { layers: L.LayerGroup }) => {
    _editedDebounced(e, isEditing, mapRef, email, setShapes);
  };
};
