import { Polyline } from "react-leaflet";
import { useShapes } from "../contexts/shapeContext";
import { popupContentStyle } from "../api/config";
import { formatCoordinates } from "../helperFunctions/formattedCoords";
import { handleDeleteLine } from "../helperFunctions/mapHelpers";
import { useUser } from "../contexts/LoginContext";

export const Polylines = function () {
  const { shapes, setShapes } = useShapes();
  const { email } = useUser();

  return (
    <>
      {shapes.polylines.map((coords, index) => (
        <Polyline
          key={index}
          positions={coords}
          color="red"
          eventHandlers={{
            click: (e) => {
              const popup = e.target
                .bindPopup(
                  `<div style="${JSON.stringify(popupContentStyle).replace(
                    /"/g,
                    ""
                  )}">
                    <strong>Coordinates: </strong>${formatCoordinates(
                      coords
                    )}<br />
                    <button id="delete-polyline-${index}" style="background-color: red; color: white; border: none; padding: 5px; cursor: pointer;">
                      Delete
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
                    handleDeleteLine(coords, email, setShapes as any);
                }
              }, 0);
            },
          }}
        />
      ))}
    </>
  );
};
