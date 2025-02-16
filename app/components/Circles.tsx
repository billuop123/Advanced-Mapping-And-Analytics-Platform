import { Circle } from "react-leaflet";
import L from "leaflet";
import { useShapes } from "../contexts/shapeContext";
import { popupContentStyle } from "../api/config";
import { handleDeleteCircle } from "../helperFunctions/mapHelpers";
import { useUser } from "../contexts/LoginContext";

export const Circles = function () {
  const { shapes, setShapes } = useShapes();
  const { email } = useUser();

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
                const popup = e.target
                  .bindPopup(
                    `<div style="${JSON.stringify(popupContentStyle).replace(
                      /"/g,
                      ""
                    )}">
                      <strong>Radius: </strong>${radius} meters<br />
                      <strong>Center: </strong>Lat: ${latLng.lat.toFixed(
                        4
                      )}, Lng: ${latLng.lng.toFixed(4)}<br />
                      <button id="delete-circle-${index}" style="background-color: red; color: white; border: none; padding: 5px; cursor: pointer;">
                        Delete
                      </button>
                    </div>`
                  )
                  .openPopup();

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
                        setShapes as any
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
