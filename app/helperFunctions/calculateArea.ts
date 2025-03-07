import L, { latLng, LatLngBounds } from "leaflet";
/**
 * Calculates the area of a polygon in square meters.
 * @param coords - Array of polygon coordinates (LatLngExpression or { lat: number; lng: number }).
 * @returns The area of the polygon in square meters.
 */

export const calculatePolygonArea = (
  coords: L.LatLngExpression[] | { lat: number; lng: number }[]
): number => {
  return L.GeometryUtil.geodesicArea(coords);
};

/**
 * Calculates the area of a rectangle in square meters.
 * @param bounds - The LatLngBounds object representing the rectangle.
 * @returns The area of the rectangle in square meters.
 */

export const calculateRectangleArea = (bounds: LatLngBounds): number => {
  const latLng1 = bounds.getNorthWest(); // Top-left corner
  const latLng2 = bounds.getSouthEast(); // Bottom-right corner

  // Calculate the width (distance between west and east edges)
  const width = latLng1.distanceTo(latLng(latLng1.lat, latLng2.lng));

  // Calculate the height (distance between north and south edges)
  const height = latLng1.distanceTo(latLng(latLng2.lat, latLng1.lng));

  // Return the area in square meters
  return width * height;
};
