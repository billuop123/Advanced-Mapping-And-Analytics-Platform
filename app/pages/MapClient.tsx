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
import { LivePositionButton } from "../components/LivePositionButton";
import { LongitudeAndLatitudeInput } from "../components/LongitudeAndLatitudeInput";
import { useRole } from "../contexts/RoleContext";
import { useShapes } from "../contexts/shapeContext";
import { useUser } from "../contexts/LoginContext";
import { useLocationContext } from "../contexts/LocationContext";
import { Map } from "@/src/domain/entities/Map";

export default function MapClient({ ref }: { ref: any }) {
  const mapRef = useRef<L.Map | null>(null);
  const { position } = usePosition();
  const featureGroupRef = useRef<L.FeatureGroup | null>(null);
  const { role } = useRole();
  const {email} = useUser();
  const { fetchShapes } = useShapes();
  const { fetchMarkers } = useLocationContext();
  
  const [map, setMap] = useState<Map>({
    id: 'default',
    zoom: 10,
    tileLayerUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  });

  useEffect(() => {
    fetchShapes();
  }, [email]);

  useEffect(() => {
    if (email) {
      fetchMarkers(email);
    }
  }, [email]);


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
        mapRef.current.off();
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapRef]);

  const handleMapTypeChange = (selectedValue: string) => {
    let newTileLayerUrl = map.tileLayerUrl;
    
    if (selectedValue === "Humanitarian") {
      newTileLayerUrl = "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";
    } else if (selectedValue === "Topographic") {
      newTileLayerUrl = "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
    } else if (selectedValue === "Default") {
      newTileLayerUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    } else if (selectedValue === "Satellite") {
      newTileLayerUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    }

    setMap(prev => ({
      ...prev,
      tileLayerUrl: newTileLayerUrl
    }));
  };

  return (
    <div className="h-full w-full">
      <MapContainer
        center={position}
        zoom={map.zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", position: "relative" }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={map.tileLayerUrl}
        />

        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white rounded-lg shadow-lg">
          <select
            value={map.tileLayerUrl.includes('hot') ? "Humanitarian" : 
                   map.tileLayerUrl.includes('opentopomap') ? "Topographic" :
                   map.tileLayerUrl.includes('arcgisonline') ? "Satellite" : "Default"}
            onChange={(e) => {
              e.stopPropagation();
              handleMapTypeChange(e.target.value);
            }}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none bg-white text-black focus:ring-2 focus:ring-blue-500"
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
          ) : null}
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