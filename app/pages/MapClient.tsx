// components/MapClient.tsx
"use client"; // Mark this as a Client Component

import axios from "axios";
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import {
  Circle,
  FeatureGroup,
  MapContainer,
  Marker,
  Polygon,
  Polyline,
  Popup,
  Rectangle,
  TileLayer,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useUser } from "../contexts/LoginContext";

import { useShapes } from "../contexts/shapeContext";
import { _created } from "../services/CreatedShape";
import { useEditedDebounced } from "../services/EditedShape";
import { useEffect, useRef } from "react";
import { DetectClick } from "../services/DetectClick";
import { usePosition } from "../contexts/PositionContext";
import ChangeCenter from "../services/ChangeCenter";
import { useDrawing } from "../contexts/IsDrawingContext";

export const customIcon = L.icon({
  iconUrl: "./marker-icon-2x-green.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapClient() {
  const { email } = useUser();
  const mapRef = useRef<L.Map | null>(null);
  const editedDebounced = useEditedDebounced(mapRef);
  const { position } = usePosition();
  const { shapes, setShapes } = useShapes();
  const { isDrawing } = useDrawing();
  const calculateRectangleArea = (bounds: L.LatLngBounds) => {
    const latLng1 = bounds.getNorthWest();
    const latLng2 = bounds.getSouthEast();
    const width = latLng1.distanceTo(L.latLng(latLng1.lat, latLng2.lng));
    const height = latLng1.distanceTo(L.latLng(latLng2.lat, latLng1.lng));
    return width * height;
  };

  const calculatePolygonArea = (coords: L.LatLngExpression[]) => {
    const polygon = L.polygon(coords);
    return L.GeometryUtil.geodesicArea(coords);
  };

  const handleDeleteCircle = async (center, radius) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/v1/circle/deleteSingleCircle",
        {
          email,
          center,
          radius,
        }
      );

      if (response.status === 200) {
        console.log("Circle deleted successfully:", response.data.message);
        setShapes((prevShapes) => ({
          ...prevShapes,
          circles: prevShapes.circles.filter(
            (circle) =>
              circle.center.lat !== center.lat ||
              circle.center.lng !== center.lng ||
              circle.radius !== radius
          ),
        }));
      } else {
        console.error("Failed to delete circle:", response.data.error);
      }
    } catch (error) {
      console.error(
        "Error deleting circle:",
        error.response?.data?.error || error.message
      );
    }
  };

  const handleDeletePolygon = async function (coords) {
    const compareCoordinates = (coord1, coord2) => {
      const match = coord1.find(
        (coord) => coord.lat === coord2.lat && coord.lng === coord2.lng
      );
      return match;
    };

    const polygonExists = shapes.polygons.some((polygon) => {
      return polygon.every((point, index) => {
        return compareCoordinates(point, coords[0][index]);
      });
    });

    if (!polygonExists) {
      console.error("No matching polygon found for deletion.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/v1/polygons/deleteSinglePolygon",
        {
          email,
          coords,
        }
      );

      if (response.status === 200) {
        console.log("Polygon deleted successfully:", response.data.message);
        setShapes((prevShapes) => ({
          ...prevShapes,
          polygons: prevShapes.polygons.filter((polygon) => {
            return !polygon.every((point, index) => {
              return compareCoordinates(point, coords[0][index]);
            });
          }),
        }));
      } else {
        console.error("Failed to delete polygon:", response.data.error);
      }
    } catch (error) {
      console.error(
        "Error deleting polygon:",
        error.response?.data?.error || error.message
      );
    }
  };

  const handleDeleteLine = function () {};
  const handleDeleteRectangle = function () {};
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove(); // Clean up the map instance

        mapRef.current = null;
      }
    };
  }, [mapRef]);
  return (
    <MapContainer
      center={position}
      zoom={10}
      scrollWheelZoom={true}
      style={{ height: "900px", width: "100%" }}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ChangeCenter pos={position} />
      <FeatureGroup>
        {shapes.polygons.map((coords, index) => {
          const area = calculatePolygonArea(coords);
          return (
            <Polygon
              key={index}
              positions={coords}
              color="blue"
              eventHandlers={{
                click: (e) => {
                  const popup = e.target
                    .bindPopup(
                      `<div>
                  <strong>Area: </strong>${area.toFixed(2)} sq meters<br />
                  <strong>Coordinates: </strong>${JSON.stringify(coords)}<br />
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
                      button.onclick = () => handleDeletePolygon(coords);
                    }
                  }, 0);
                },
              }}
            />
          );
        })}

        {shapes.circles.map((circle, index) => {
          const radius = circle.radius;
          const center = circle.center;
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
                      `<div>
                  <strong>Radius: </strong>${radius} meters<br />
                  <strong>Center: </strong>${JSON.stringify(center)}<br />
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
                      button.onclick = () => handleDeleteCircle(center, radius);
                    }
                  }, 0);
                },
              }}
            />
          );
        })}

        {shapes.polylines.map((coords, index) => {
          return (
            <Polyline
              key={index}
              positions={coords}
              color="red"
              eventHandlers={{
                click: (e) => {
                  const popup = e.target
                    .bindPopup(
                      `<div>
                  <strong>Coordinates: </strong>${JSON.stringify(coords)}<br />
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
                      button.onclick = () => handleDeleteLine(coords);
                    }
                  }, 0);
                },
              }}
            />
          );
        })}

        {shapes.rectangles.map((bounds, index) => {
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
                      `<div>
                  <strong>Area: </strong>${area.toFixed(2)} sq meters<br />
                  <strong>Bounds: </strong>${JSON.stringify(bounds)}<br />
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
                      button.onclick = () => handleDeleteRectangle(bounds);
                    }
                  }, 0);
                },
              }}
            />
          );
        })}

        <EditControl
          position="topright"
          draw={{
            polygon: true,
            polyline: true,
            circle: true,
            rectangle: true,
            marker: true,
          }}
          onDrawStart={() => {
            isDrawing.current = true; // Set drawing state to true
          }}
          onDrawStop={() => {
            isDrawing.current = false; // Set drawing state to false
          }}
          onCreated={(e) => _created(e, email, setShapes)}
          onEdited={editedDebounced}
        />
      </FeatureGroup>
      <Marker position={position} icon={customIcon}>
        <Popup>Your current position</Popup>
      </Marker>
      <DetectClick />
    </MapContainer>
  );
}
