"use client";
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import {
  FeatureGroup,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import { customIcon } from "../api/config";
import { Circles } from "../components/Circles";
import { LocationArray } from "../components/LocationArray";
import { Polygons } from "../components/Polygons";
import { Polylines } from "../components/Polylines";
import { Rectangles } from "../components/Rectangles";
import { usePosition } from "../contexts/PositionContext";
import ChangeCenter from "../services/ChangeCenter";
import { DetectClick } from "../services/DetectClick";
import { EditControls } from "../services/EditControl";
import { LivePositionButton } from "../components/LivePosition.Button";
import { LongitudeAndLatitudeInput } from "../components/LongitudeAndLatitudeInput";
import { useRole } from "../contexts/RoleContext";
import { useSession } from "next-auth/react";

export default function MapClient({ ref }: { ref: any }) {
  const mapRef = useRef<L.Map | null>(null);
  const { position } = usePosition();
  const featureGroupRef = useRef<L.FeatureGroup | null>(null);
  const [tileLayerUrl, setTileLayerUrl] = useState(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  );
  const { role } = useRole();
  const session=useSession()
  console.log(session.data)
  useImperativeHandle(ref, () => ({
    handleResize() {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    },
  }));
  useEffect(() => {
    const handlePopState = () => {
  
      window.location.reload();
    };


    window.addEventListener("popstate", handlePopState);

   
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  useEffect(() => {
    return () => {
      console.log("called cleanup");
      if (mapRef.current) {
        mapRef.current.off();
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapRef]);

  return (
    <div>
      <MapContainer
        center={position}
        zoom={10}
        scrollWheelZoom={true}
        style={{ height: "100vh", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={tileLayerUrl}
        />

        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 1000,
            backgroundColor: "white",
            padding: "5px",
            borderRadius: "5px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <select
            onChange={(e) => {
              const selectedValue = e.target.value;
              e.stopPropagation();

              if (selectedValue === "Humanitarian") {
                setTileLayerUrl(
                  "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                );
              } else if (selectedValue === "Topographic") {
                setTileLayerUrl(
                  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                );
              } else if (selectedValue === "Default") {
                setTileLayerUrl(
                  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                );
              }
            }}
          >
            <option value="Default">Default</option>
            <option value="Humanitarian">Humanitarian</option>
            <option value="Topographic">Topographic</option>
          </select>
        </div>

        <ChangeCenter pos={position} />
        <FeatureGroup ref={featureGroupRef}>
          <Polygons />
          <Circles />
          <Polylines />
          <Rectangles />
          <LocationArray />
          {role === "editor" || role === "admin" ? (
            <EditControls featureGroupRef={featureGroupRef} />
          ) : (
            ""
          )}
        </FeatureGroup>
        <Marker position={position} icon={customIcon}>
          <Popup>Your current position</Popup>
        </Marker>
        <DetectClick />
        <LivePositionButton />
        <LongitudeAndLatitudeInput />
      </MapContainer>
    </div>
  );
}
