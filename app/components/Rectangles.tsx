import React from "react";
import { Rectangle } from "react-leaflet";
import { popupContentStyle } from "../api/config";
import { formatCoordinatesRectangle } from "../helperFunctions/formattedCoords";
import { handleDeleteRectangle } from "../helperFunctions/mapHelpers";
import { calculateRectangleArea } from "../helperFunctions/calculateArea";
import { useShapes } from "../contexts/shapeContext";
import { useUser } from "../contexts/LoginContext";
import { useRole } from "../contexts/RoleContext";
import { LatLng, LatLngBounds } from "leaflet";
interface ShapesState {
  circles: { center: LatLng; radius: number }[];
  polygons: LatLng[][];
  polylines: LatLng[][];
  rectangles: LatLngBounds[]; // Use LatLngBounds instead of LatLng[][]
}
export const Rectangles = () => {
  const { shapes, setShapes } = useShapes();
  const { email } = useUser();
  const { role } = useRole();
  return shapes.rectangles.map((bounds, index) => {
    const area = calculateRectangleArea(bounds);

    return (
      <Rectangle
        key={index}
        bounds={bounds}
        color="purple"
        eventHandlers={{
          click: (e) => {
            const deleteButton =
              role !== "viewer"
                ? `<button id="delete-circle-${index}" style="background-color: red; color: white; border: none; padding: 5px; cursor: pointer;">
                        Delete
                      </button>`
                : ""; // Empty string if role is "viewer"
            e.target
              .bindPopup(
                `<div style="${JSON.stringify(popupContentStyle).replace(
                  /"/g,
                  ""
                )}">
                  <strong>Area: </strong>${area.toFixed(2)} sq meters<br />
                  <strong>Bounds: </strong>${formatCoordinatesRectangle(
                    bounds
                  )}<br />
                  <button id="delete-rectangle-${index}" style="background-color: red; color: white; border: none; padding: 5px; cursor: pointer;">
                    ${deleteButton}
                  </button>
                </div>`
              )
              .openPopup();

            setTimeout(() => {
              const button = document.getElementById(
                `delete-rectangle-${index}`
              );
              if (button) {
                button.onclick = () =>
                  handleDeleteRectangle(
                    bounds,
                    email,
                    setShapes as React.Dispatch<
                      React.SetStateAction<ShapesState>
                    >
                  );
              }
            }, 0);
          },
        }}
      />
    );
  });
};
