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
import Link from "next/link";

export default function MapClient({ ref }: { ref: any }) {
  const mapRef = useRef<L.Map | null>(null);
  const { position } = usePosition();
  const featureGroupRef = useRef<L.FeatureGroup | null>(null);
  const [tileLayerUrl, setTileLayerUrl] = useState(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  );
  const [selectedMapType, setSelectedMapType] = useState("Default");
  const { role } = useRole();
  const session = useSession();
  console.log(session.data);

  useEffect(() => {
    if (!sessionStorage.getItem('hasReloaded')) {
      sessionStorage.setItem('hasReloaded', 'true');
      window.location.reload();
    }
    return () => {
      sessionStorage.removeItem('hasReloaded');
    };
  }, []);

  useImperativeHandle(ref, () => ({
    handleResize() {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    },
  }));

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

        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white rounded-lg shadow-lg">
          <select
            value={selectedMapType}
            onChange={(e) => {
              const selectedValue = e.target.value;
              e.stopPropagation();
              setSelectedMapType(selectedValue);

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
              } else if (selectedValue === "Satellite") {
                setTileLayerUrl(
                  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                );
              }
            }}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Default">Default</option>
            <option value="Humanitarian">Humanitarian</option>
            <option value="Topographic">Topographic</option>
            <option value="Satellite">Satellite</option>
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