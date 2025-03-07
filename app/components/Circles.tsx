import { Circle } from "react-leaflet";
import L, { LatLng, LatLngBounds } from "leaflet";
import { useShapes } from "../contexts/shapeContext";
import { popupContentStyle } from "../api/config";
import { handleDeleteCircle } from "../helperFunctions/mapHelpers";
import { useUser } from "../contexts/LoginContext";
import { useRole } from "../contexts/RoleContext";
interface ShapesState {
  circles: { center: LatLng; radius: number }[];
  polygons: LatLng[][];
  polylines: LatLng[][];
  rectangles: LatLngBounds[]; // Use LatLngBounds instead of LatLng[][]
}
export const Circles = function () {
  const { shapes, setShapes } = useShapes();
  const { email } = useUser();
  const { role } = useRole();

  return (
    <>
      {shapes.circles.map((circle, index) => {
        const radius = circle.radius;
        const center: L.LatLngExpression = circle.center;
        const latLng = L.latLng(center);

        return (
          <Circle
            key={index}
            center={center}
            radius={radius}
            color="green"
            eventHandlers={{
              click: (e) => {
                const deleteButton =
                  role !== "viewer"
                    ? `<button id="delete-circle-${index}" style="background-color: red; color: white; border: none; padding: 5px; cursor: pointer;">
                        Delete
                      </button>`
                    : "";

                const popupContent = `
                  <div style="${JSON.stringify(popupContentStyle).replace(
                    /"/g,
                    ""
                  )}">
                    <strong>Radius: </strong>${radius} meters<br />
                    <strong>Center: </strong>Lat: ${latLng.lat.toFixed(
                      4
                    )}, Lng: ${latLng.lng.toFixed(4)}<br />
                    ${deleteButton}
                  </div>`;

                e.target.bindPopup(popupContent).openPopup();

                if (role !== "viewer") {
                  setTimeout(() => {
                    const button = document.getElementById(
                      `delete-circle-${index}`
                    );
                    if (button) {
                      button.onclick = () =>
                        handleDeleteCircle(
                          center,
                          radius,
                          email,
                          setShapes as React.Dispatch<
                            React.SetStateAction<ShapesState>
                          >
                        );
                    }
                  }, 0);
                }
              },
            }}
          />
        );
      })}
    </>
  );
};
