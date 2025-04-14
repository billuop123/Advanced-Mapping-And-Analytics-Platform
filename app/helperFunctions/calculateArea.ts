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
  const northWest = bounds.getNorthWest();
  const northEast = bounds.getNorthEast();
  const southEast = bounds.getSouthEast();
  const southWest = bounds.getSouthWest();

  // Create a polygon from the rectangle's corners
  const polygon = [northWest, northEast, southEast, southWest, northWest];
  
  // Use Leaflet's geodesicArea method for accurate area calculation
  return L.GeometryUtil.geodesicArea(polygon);
};
