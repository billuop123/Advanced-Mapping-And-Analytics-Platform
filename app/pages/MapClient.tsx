"use client";
import React, { useRef, useState, useEffect, useImperativeHandle } from "react";
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
import { useDrawing } from "../contexts/IsDrawingContext";
import { usePosition } from "../contexts/PositionContext";
import { useShapes } from "../contexts/shapeContext";
import {
  handleDeleteCircle,
  handleDeleteLine,
  handleDeletePolygon,
  handleDeleteRectangle,
} from "../helperFunctions/mapHelpers";
import ChangeCenter from "../services/ChangeCenter";
import { _created, handleMarkerMove } from "../services/CreatedShape";
import { DetectClick } from "../services/DetectClick";
import { useEditedDebounced } from "../services/EditedShape";
import {
  formatCoordinates,
  formatCoordinatesPolygon,
  formatCoordinatesRectangle,
} from "../helperFunctions/formattedCoords";
import {
  calculatePolygonArea,
  calculateRectangleArea,
} from "../helperFunctions/calculateArea";
import { useLocationContext } from "../contexts/LocationContext";
import axios from "axios";

export const customIcon = L.icon({
  iconUrl: "./marker-icon-2x-green.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const popupContentStyle = {
  backgroundColor: "#fff",
  padding: "10px",
  borderRadius: "5px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
  fontSize: "14px",
  color: "#333",
};

const dropupMenuStyle = {
  position: "absolute",
  bottom: "10px",
  right: "10px",
  backgroundColor: "#fff",
  padding: "10px",
  borderRadius: "5px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
  zIndex: 1000,
};

const places = [
  { id: 1, name: "Hospital" },
  { id: 2, name: "Temple" },
  { id: 3, name: "School" },
  { id: 4, name: "Mall" },
  { id: 5, name: "Park" },
  { id: 6, name: "Others" },
];
const customIconFunction = (type: string) => {
  return new L.Icon({
    iconUrl: `/${type}.svg`,

    shadowUrl: "/marker-shadow.png",

    iconSize: [30, 41],

    iconAnchor: [12, 41],

    popupAnchor: [1, -34],

    shadowSize: [41, 41],
  });
};

export default function MapClient({ ref }) {
  const { email } = useUser();
  const mapRef = useRef<L.Map | null>(null);
  const editedDebounced = useEditedDebounced(mapRef);
  const { position, setPosition } = usePosition();
  const { shapes, setShapes } = useShapes();
  const { isDrawing } = useDrawing();
  const [isMarkerActive, setIsMarkerActive] = useState(false);
  const [description, setDescription] = useState("");
  const { allLocationArray } = useLocationContext();
  const { setAllLocationArray } = useLocationContext();
  useImperativeHandle(ref, () => ({
    handleResize() {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    },
  }));
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapRef]);
  const handleDeleteMarker = async (latitude: number, longitude: number) => {
    try {
      await axios.post("http://localhost:3001/api/v1/marker/deleteMarker", {
        email,
        coordinates: {
          lat: latitude,
          lng: longitude,
        },
      });
    } catch (err) {
      console.log(err);
    }
    setAllLocationArray((prev) =>
      prev.filter(
        (location) =>
          location.latitude !== latitude || location.longitude !== longitude
      )
    );
  };
  const handleClickCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      },
      (error) => {
        console.error("Error fetching location:", error);
      }
    );
  };
  return (
    <MapContainer
      center={position}
      zoom={10}
      scrollWheelZoom={true}
      style={{ height: "100vh", width: "100%" }}
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
                        handleDeletePolygon(coords, setShapes, shapes, email);
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
                      `<div style="${JSON.stringify(popupContentStyle).replace(
                        /"/g,
                        ""
                      )}">
                        <strong>Radius: </strong>${radius} meters<br />
                        <strong>Center: </strong>Lat: ${center.lat.toFixed(
                          4
                        )}, Lng: ${center.lng.toFixed(4)}<br />
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
                        handleDeleteCircle(center, radius, email, setShapes);
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
                        handleDeleteLine(coords, email, setShapes);
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
                      `<div style="${JSON.stringify(popupContentStyle).replace(
                        /"/g,
                        ""
                      )}">
                        <strong>Area: </strong>${area.toFixed(
                          2
                        )} sq meters<br />
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
        })}
        {allLocationArray.map((location, index) => (
          <Marker
            key={index}
            position={[location.latitude, location.longitude]}
            icon={customIconFunction(location.type)}
            eventHandlers={{
              moveend: (e) => {
                const marker = e.target;
                const previousCoordinates = [
                  location.latitude,
                  location.longitude,
                ];
                handleMarkerMove(marker, previousCoordinates);
              },
            }}
          >
            <Popup>
              <div style={popupContentStyle}>
                <strong>{location.description}</strong>
                <br />
                <strong>Type:</strong> {location.type}
                <br />
                <strong>Latitude:</strong>{" "}
                {parseFloat(location.latitude).toFixed(6)}
                <br />
                <strong>Longitude:</strong> {location.longitude}
                <br />
                <button
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    // Call a function to delete the marker
                    handleDeleteMarker(location.latitude, location.longitude);
                  }}
                >
                  Delete
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        <EditControl
          position="topright"
          draw={{
            polygon: true,
            polyline: true,
            circle: true,
            rectangle: true,
            marker: {
              icon: customIcon,
            },
          }}
          onDrawStart={(e) => {
            console.log("onDrawStart Event:", e);
            if (e.layerType === "marker") {
              console.log("Marker drawing started");
            }
            isDrawing.current = true;
          }}
          onDrawStop={() => {
            setIsMarkerActive(false);
            isDrawing.current = false;
          }}
          onCreated={(e) => {
            if (e.layerType === "marker") {
              setIsMarkerActive(true);
            }
            _created(e, email, setShapes);
          }}
          onEdited={editedDebounced}
        />
      </FeatureGroup>
      <Marker position={position} icon={customIcon}>
        <Popup>Your current position</Popup>
      </Marker>
      <DetectClick />

      {isMarkerActive && (
        <div style={dropupMenuStyle}>
          <select>
            {places.map((place) => (
              <option key={place.id} value={place.id}>
                {place.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Description of place"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      )}

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
          }}
        >
          <button
            onClick={handleClickCurrentPosition}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "5px",
              cursor: "pointer",
              boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
              fontSize: "14px",
            }}
          >
            Live Position
          </button>
        </div>
      </div>
    </MapContainer>
  );
}
