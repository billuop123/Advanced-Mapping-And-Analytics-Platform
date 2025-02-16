import { LatLngExpression } from "leaflet";

export const calculatePolygonArea = (
  coords: { lat: number; lng: number }[][] | LatLngExpression[]
) => {
  const flattenedCoords = coords.flat();

  let area = 0;
  const n = flattenedCoords.length;

  for (let i = 0; i < n; i++) {
    const latLng1 = flattenedCoords[i];
    const latLng2 = flattenedCoords[(i + 1) % n];

    area +=
      (latLng2!.lng - latLng1!.lng) *
      (latLng1!.lat + latLng2!.lat) *
      (Math.PI / 180) *
      6378137 *
      6378137;
  }

  return Math.abs(area) / 2;
};
export const calculateRectangleArea = (bounds: L.LatLngBounds) => {
  const latLng1 = bounds.getNorthWest();
  const latLng2 = bounds.getSouthEast();
  const width = latLng1.distanceTo(L.latLng(latLng1.lat, latLng2.lng));
  const height = latLng1.distanceTo(L.latLng(latLng2.lat, latLng1.lng));
  return width * height;
};
