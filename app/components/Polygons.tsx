import "leaflet-draw";
import { Polygon } from "react-leaflet";
import { popupContentStyle, deleteButtonStyle } from "../api/config";
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
  rectangles: LatLngBounds[]; 
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
                    ? `<button id="delete-polygon-${index}" style="${JSON.stringify(deleteButtonStyle).replace(/"/g, "")}">
                        Delete
                      </button>`
                    : ""; 

                const formattedCoords = formatCoordinatesPolygon(coords);

                e.target
                  .bindPopup(
                    `<div style="${JSON.stringify(popupContentStyle).replace(
                      /"/g,
                      ""
                    )}">
                      <div style="margin-bottom: 8px;">
                        <strong>Area: </strong>${area} sq meters<br />
                        <strong>Coordinates: </strong>${formattedCoords}
                      </div>
                      ${deleteButton ? `<button 
                        id="delete-polygon-${index}" 
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
