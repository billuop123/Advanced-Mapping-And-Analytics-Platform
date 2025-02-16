import { Polygon } from "react-leaflet";
import { useShapes } from "../contexts/shapeContext";
import { formatCoordinatesPolygon } from "../helperFunctions/formattedCoords";
import { calculatePolygonArea } from "../helperFunctions/calculateArea";
import { handleDeletePolygon } from "../helperFunctions/mapHelpers";
import { popupContentStyle } from "../api/config";
import { useUser } from "../contexts/LoginContext";

export const Polygons = function () {
  const { shapes, setShapes } = useShapes();
  const { email } = useUser();

  return (
    <>
      {shapes.polygons.map((coords, index) => {
        const area = calculatePolygonArea(coords);

        return (
          <Polygon
            key={index}
            positions={coords}
            color="blue"
            eventHandlers={{
              click: (e) => {
                const formattedCoords = formatCoordinatesPolygon(coords);
                const popup = e.target
                  .bindPopup(
                    `<div style="${JSON.stringify(popupContentStyle).replace(
                      /"/g,
                      ""
                    )}">
                        <strong>Area: </strong>${area} sq meters<br />
                        <strong>Coordinates: </strong>${formattedCoords}<br />
                        <button id="delete-polygon-${index}" style="background-color: red; color: white; border: none; padding: 5px; cursor: pointer;">
                          Delete
                        </button>
                      </div>`
                  )
                  .openPopup();

                setTimeout(() => {
                  const button = document.getElementById(
                    `delete-polygon-${index}`
                  );
                  if (button) {
                    button.onclick = () =>
                      handleDeletePolygon(
                        coords,
                        setShapes as any,
                        shapes as any,
                        email
                      );
                  }
                }, 0);
              },
            }}
          />
        );
      })}
    </>
  );
};
