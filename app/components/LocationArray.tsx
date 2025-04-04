import React from "react";
import { Marker, Popup } from "react-leaflet"; // Assuming you're using react-leaflet

import { customIconFunction, popupContentStyle, deleteButtonStyle } from "../api/config";
import { useLocationContext } from "../contexts/LocationContext";
import axios from "axios";
import { useUser } from "../contexts/LoginContext";

export const LocationArray = () => {
  const { allLocationArray, setAllLocationArray } = useLocationContext();

  const { email } = useUser();
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
  return allLocationArray.map((location, index) => (
    <Marker
      key={index}
      position={[location.latitude, location.longitude]}
      icon={customIconFunction(location.type)}
    >
      <Popup>
        <div style={popupContentStyle}>
          <div style={{ marginBottom: "8px" }}>
            <strong>{location.description}</strong>
            <br />
            <strong>Type:</strong> {location.type}
            <br />
            <strong>Latitude:</strong>{" "}
            {parseFloat(location.latitude.toString()).toFixed(6)}
            <br />
            <strong>Longitude:</strong> {location.longitude}
          </div>
          <button
            style={deleteButtonStyle}
            onClick={() => {
              handleDeleteMarker(location.latitude, location.longitude);
            }}
          >
            Delete
          </button>
        </div>
      </Popup>
    </Marker>
  ));
};
