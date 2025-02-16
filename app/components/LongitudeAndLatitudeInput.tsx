"use client";
import { useState } from "react";
import { usePosition } from "../contexts/PositionContext";

export const LongitudeAndLatitudeInput = function () {
  const [latitude, setLatitude] = useState("");
  const { setPosition } = usePosition();
  const [longitude, setLongitude] = useState("");

  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLatitude(e.target.value);
  };
  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLongitude(e.target.value);
  };
  const handleGoToCoordinates = () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      setPosition([lat, lng]);
    }
  };
  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "5px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
      }}
    >
      <div style={{ display: "flex", gap: "5px" }}>
        <input
          type="text"
          placeholder="Latitude"
          value={latitude}
          onChange={handleLatitudeChange}
          style={{
            padding: "5px",
            borderRadius: "3px",
            border: "1px solid #ccc",
            width: "100px",
          }}
        />
        <input
          type="text"
          placeholder="Longitude"
          value={longitude}
          onChange={handleLongitudeChange}
          style={{
            padding: "5px",
            borderRadius: "3px",
            border: "1px solid #ccc",
            width: "100px",
          }}
        />
      </div>
      <button
        onClick={handleGoToCoordinates}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          padding: "5px 10px",
          borderRadius: "3px",
          cursor: "pointer",
          fontSize: "12px",
        }}
      >
        Go to Coordinates
      </button>
    </div>
  );
};
