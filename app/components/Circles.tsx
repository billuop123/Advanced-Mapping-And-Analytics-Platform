import { Circle } from "react-leaflet";
import L, { LatLng, LatLngBounds } from "leaflet";
import { useShapes } from "../contexts/shapeContext";
import { popupContentStyle, deleteButtonStyle } from "../api/config";
import { handleDeleteCircle } from "../helperFunctions/mapHelpers";
import { useUser } from "../contexts/LoginContext";
import { useRole } from "../contexts/RoleContext";
import { ShapesState } from "@/src/domain/entities/Map";

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
                    ? `<button id="delete-circle-${index}" style="${JSON.stringify(deleteButtonStyle).replace(/"/g, "")}">
                        Delete
                      </button>`
                    : "";

                const popupContent = `
                  <div style="${JSON.stringify(popupContentStyle).replace(
                    /"/g,
                    ""
                  )}">
                    <div style="margin-bottom: 8px;">
                      <strong>Radius: </strong>${radius} meters<br />
                      <strong>Center: </strong>Lat: ${latLng.lat.toFixed(
                        4
                      )}, Lng: ${latLng.lng.toFixed(4)}
                    </div>
                    ${deleteButton ? `<button 
                      id="delete-circle-${index}" 
                      style="background-color: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-top: 8px; font-size: 14px; width: 100%; text-align: center; transition: all 0.2s ease-in-out; font-weight: 500; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; outline: none;"
                      onmouseover="this.style.backgroundColor='#dc2626'; this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.1)'"
                      onmouseout="this.style.backgroundColor='#ef4444'; this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'"
                      onmousedown="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'"
                      onmouseup="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.1)'"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                      Delete
                    </button>` : ''}
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
