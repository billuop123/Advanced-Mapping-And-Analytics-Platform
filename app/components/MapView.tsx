"use client";

import { MapContainer, Polygon, TileLayer, Polyline, Rectangle, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import L from "leaflet";
import { formatCoordinatesPolygon } from "../helperFunctions/formattedCoords";
import { popupContentStyle } from "../api/config";
import { LatLngExpression, LatLngBounds } from "leaflet";

export default function MapView({ shapeCoords, shapeType }: { shapeCoords: any, shapeType: string }) {
  const mapRef = useRef<L.Map | null>(null);
  let position: LatLngExpression = [0, 0];

  // Set default position to [0, 0] if shapeCoords is not available
  // if(shapeType === "polygon"){
  //  position: LatLngExpression = shapeCoords?.[0] 
  //   ? [shapeCoords[0].lat, shapeCoords[0].lng] 
  //   : [0, 0];}
  useEffect(()=>{
    if(shapeType === "polygon"){
      position = [shapeCoords[0].lat, shapeCoords[0].lng] as LatLngExpression;
    }
    if(shapeType === "polyline"){
      position = [shapeCoords[0].lat, shapeCoords[0].lng] as LatLngExpression;
    }
    if(shapeType === "rectangle"){
      position = [shapeCoords.bounds.northeast.lat, shapeCoords.bounds.northeast.lng] as LatLngExpression;
    }
    if(shapeType === "circle"){
      position = [shapeCoords.center.lat, shapeCoords.center.lng] as LatLngExpression;
    }
  },[shapeType])
  useEffect(() => {
    if (mapRef.current && shapeCoords) {
      let bounds;
      if (shapeType === "rectangle") {
        bounds = L.latLngBounds(
          [shapeCoords.bounds.southwest.lat, shapeCoords.bounds.southwest.lng],
          [shapeCoords.bounds.northeast.lat, shapeCoords.bounds.northeast.lng]
        );
      } else if (shapeType === "circle") {
        const center = L.latLng(shapeCoords.center.lat, shapeCoords.center.lng);
        const radius = shapeCoords.radius;
        const circleBounds = center.toBounds(radius);
        bounds = L.latLngBounds(
          [circleBounds.getSouthWest().lat, circleBounds.getSouthWest().lng],
          [circleBounds.getNorthEast().lat, circleBounds.getNorthEast().lng]
        );
      } else {
        bounds = L.latLngBounds(shapeCoords);
      }
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [shapeCoords]);

  return (
    <div className="w-full h-screen">
      <MapContainer
        center={position}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {shapeType === "polygon" && shapeCoords && (
          <Polygon 
            positions={shapeCoords} 
            color="blue"
            eventHandlers={{
              click: (e) => {
                const formattedCoords = formatCoordinatesPolygon(shapeCoords);

                e.target
                  .bindPopup(
                    `<div style="${JSON.stringify(popupContentStyle).replace(/"/g, "")}">
                      <div style="margin-bottom: 8px;">
                        <strong>Coordinates: </strong>${formattedCoords}
                      </div>
                    </div>`
                  )
                  .openPopup();
              }
            }}
          />
        )}
        {shapeType === "polyline" && shapeCoords && (
          <Polyline 
            positions={shapeCoords} 
            color="red"
            eventHandlers={{
              click: (e) => {
                const formattedCoords = formatCoordinatesPolygon(shapeCoords);

                e.target
                  .bindPopup(
                    `<div style="${JSON.stringify(popupContentStyle).replace(/"/g, "")}">
                      <div style="margin-bottom: 8px;">
                        <strong>Coordinates: </strong>${formattedCoords}
                      </div>
                    </div>`
                  )
                  .openPopup();
              }
            }}
          />
        )}
        {shapeType === "rectangle" && shapeCoords && (
          <Rectangle 
            bounds={[
              [shapeCoords.bounds.southwest.lat, shapeCoords.bounds.southwest.lng],
              [shapeCoords.bounds.northeast.lat, shapeCoords.bounds.northeast.lng]
            ]}
            color="purple"
            eventHandlers={{
              click: (e) => {
                const formattedCoords = `Northeast: (${shapeCoords.bounds.northeast.lat}, ${shapeCoords.bounds.northeast.lng})
Southwest: (${shapeCoords.bounds.southwest.lat}, ${shapeCoords.bounds.southwest.lng})`;

                e.target
                  .bindPopup(
                    `<div style="${JSON.stringify(popupContentStyle).replace(/"/g, "")}">
                      <div style="margin-bottom: 8px;">
                        <strong>Coordinates: </strong>${formattedCoords}
                      </div>
                    </div>`
                  )
                  .openPopup();
              }
            }}
          />
        )}
        {shapeType === "circle" && shapeCoords && (
          <Circle 
            center={[shapeCoords.center.lat, shapeCoords.center.lng]}
            radius={shapeCoords.radius}
            color="green"
            eventHandlers={{
              click: (e) => {
                const formattedCoords = `Center: (${shapeCoords.center.lat}, ${shapeCoords.center.lng})
Radius: ${shapeCoords.radius.toFixed(2)} meters`;

                e.target
                  .bindPopup(
                    `<div style="${JSON.stringify(popupContentStyle).replace(/"/g, "")}">
                      <div style="margin-bottom: 8px;">
                        <strong>Coordinates: </strong>${formattedCoords}
                      </div>
                    </div>`
                  )
                  .openPopup();
              }
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}