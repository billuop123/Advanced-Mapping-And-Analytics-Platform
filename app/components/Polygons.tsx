import "leaflet-draw";
import { Polygon } from "react-leaflet";
import { popupContentStyle } from "../api/config";
import { useUser } from "../contexts/LoginContext";
import { useRole } from "../contexts/RoleContext";
import { useShapes } from "../contexts/shapeContext";
import { formatCoordinatesPolygon } from "../helperFunctions/formattedCoords";
import { handleDeletePolygon } from "../helperFunctions/mapHelpers";
import { calculatePolygonArea } from "../helperFunctions/calculateArea";
import { LatLng, LatLngBounds } from "leaflet";
interface ShapesState {
  circles: { center: LatLng; radius: number }[];
  polygons: LatLng[][];
  polylines: LatLng[][];
  rectangles: LatLngBounds[]; // Use LatLngBounds instead of LatLng[][]
}
export const Polygons = function () {
  const { shapes, setShapes } = useShapes();
  const { email } = useUser();
  const { role } = useRole();

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
                const deleteButton =
                  role !== "viewer"
                    ? `<button id="delete-polygon-${index}" style="background-color: red; color: white; border: none; padding: 5px; cursor: pointer;">
                        Delete
                      </button>`
                    : ""; // Empty string if role is "viewer"

                const formattedCoords = formatCoordinatesPolygon(coords);

                e.target
                  .bindPopup(
                    `<div style="${JSON.stringify(popupContentStyle).replace(
                      /"/g,
                      ""
                    )}">
                      <strong>Area: </strong>${area} sq meters<br />
                      <strong>Coordinates: </strong>${formattedCoords}<br />
                      ${deleteButton}
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
                        setShapes as React.Dispatch<
                          React.SetStateAction<ShapesState>
                        >,
                        shapes as ShapesState,
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
