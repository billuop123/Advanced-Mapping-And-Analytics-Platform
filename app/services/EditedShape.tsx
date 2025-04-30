"use client";
import axios from "axios";
import L from "leaflet";
import { debounce } from "lodash";
import { useRef } from "react";
import { useUser } from "../contexts/LoginContext";
import { useShapes } from "../contexts/shapeContext";
import { API_ENDPOINTS } from "@/src/config/api";
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


      const editedLayers = e.layers.getLayers();

 
      const editedLayerIds = new Set(
        editedLayers.map((layer) => (layer as any)._leaflet_id)
      );

      const shapesToCreate: any[] = [];

      for (const layer of allLayers) {
        console.log("Processing layer:", layer);


        if (editedLayerIds.has((layer as any)._leaflet_id)) {
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


            console.log("Edited Rectangle:", newShape);
            console.log("Initial State:", initialState);

            shapesToCreate.push(newShape);
          } else if (layer instanceof L.Polygon) {
            const coords = layer.getLatLngs();
            const newShape = {
              type: "POLYGON",
              data: { coords: coords.flat() },
            };

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

  
            console.log("Edited Circle:", newShape);
            console.log("Initial State:", initialState);

            shapesToCreate.push(newShape);
          } else if (layer instanceof L.Polyline) {
            const coords = layer.getLatLngs();
            const newShape = {
              type: "POLYLINE",
              data: { coords: coords.flat() },
            };

     
            console.log("Edited Polyline:", newShape);
            console.log("Initial State:", initialState);

            shapesToCreate.push(newShape);
          }
        } else {
      
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
          `${API_ENDPOINTS.SHAPES.DELETE_ALL}`,
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
              `${API_ENDPOINTS.SHAPES.BATCH_CREATE}`,
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
        if (editedLayerIds.has((layer as any)._leaflet_id)) {
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
