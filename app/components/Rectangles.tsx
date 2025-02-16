import React from "react";
import { Rectangle } from "react-leaflet";
import { popupContentStyle } from "../api/config";
import { formatCoordinatesRectangle } from "../helperFunctions/formattedCoords";
import { handleDeleteRectangle } from "../helperFunctions/mapHelpers";
import { calculateRectangleArea } from "../helperFunctions/calculateArea";
import { useShapes } from "../contexts/shapeContext";
import { useUser } from "../contexts/LoginContext";

export const Rectangles = () => {
  const { shapes, setShapes } = useShapes();
  const { email } = useUser();
  return shapes.rectangles.map((bounds, index) => {
    const area = calculateRectangleArea(bounds);

    return (
      <Rectangle
        key={index}
        bounds={bounds}
        color="purple"
        eventHandlers={{
          click: (e) => {
            const popup = e.target
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
                    Delete
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
                  handleDeleteRectangle(bounds, email, setShapes);
              }
            }, 0);
          },
        }}
      />
    );
  });
};
