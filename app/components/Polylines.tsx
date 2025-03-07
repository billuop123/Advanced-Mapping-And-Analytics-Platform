import { Polyline } from "react-leaflet";
import { useShapes } from "../contexts/shapeContext";
import { popupContentStyle } from "../api/config";
import { formatCoordinates } from "../helperFunctions/formattedCoords";
import { handleDeleteLine } from "../helperFunctions/mapHelpers";
import { useUser } from "../contexts/LoginContext";
import { useRole } from "../contexts/RoleContext";
import { LatLngBounds } from "leaflet";
import { LatLng } from "leaflet";
interface ShapesState {
  circles: { center: LatLng; radius: number }[];
  polygons: LatLng[][];
  polylines: LatLng[][];
  rectangles: LatLngBounds[]; // Use LatLngBounds instead of LatLng[][]
}
export const Polylines = function () {
  const { shapes, setShapes } = useShapes();
  const { email } = useUser();
  const { role } = useRole();
  return (
    <>
      {shapes.polylines.map((coords, index) => (
        <Polyline
          key={index}
          positions={coords}
          color="red"
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
                    <strong>Coordinates: </strong>${formatCoordinates(
                      coords
                    )}<br />
                    <button id="delete-polyline-${index}" style=" color: white; border: none; padding: 5px; cursor: pointer;">
                     ${deleteButton}
                    </button>
                  </div>`
                )
                .openPopup();

              setTimeout(() => {
                const button = document.getElementById(
                  `delete-polyline-${index}`
                );
                if (button) {
                  button.onclick = () =>
                    handleDeleteLine(
                      coords,
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
      ))}
    </>
  );
};
