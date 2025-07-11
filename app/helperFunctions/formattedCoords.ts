import L from "leaflet";

/**
 * Formats the coordinates of a rectangle (L.Bounds) into a readable string.
 * @param coords - The bounds of the rectangle.
 * @returns A formatted string representing the southwest and northeast corners.
 */
export const formatCoordinatesRectangle = (coords: L.LatLngBounds): string => {
  if (coords) {
    const southWest = coords.getSouthWest();
    const northEast = coords.getNorthEast();
    return `SouthWest: Lat: ${southWest.lat.toFixed(4)}, Lng: ${southWest.lng.toFixed(4)}<br />NorthEast: Lat: ${northEast.lat.toFixed(4)}, Lng: ${northEast.lng.toFixed(4)}`;
  }

  console.error("Invalid coordinates:", coords);
  return "Invalid coordinates";
};

/**
 * Formats the coordinates of a polygon into a readable string.
 * @param coords - An array of coordinates representing the polygon.
 * @returns A formatted string of the coordinates.
 */
export const formatCoordinatesPolygon = (
  coords: L.LatLngExpression[]
): string => {
  if (!Array.isArray(coords)) {
    console.error("Invalid coordinates: coords is not an array", coords);
    return "Invalid coordinates";
  }

  const flattenedCoords = coords.flat();

  return flattenedCoords
    .map((coord, index) => {
      if (
        coord &&
        typeof coord === "object" &&
        "lat" in coord &&
        "lng" in coord
      ) {
        if (typeof coord.lat === "number" && typeof coord.lng === "number") {
          return `Lat: ${coord.lat.toFixed(4)}, Lng: ${coord.lng.toFixed(4)}`;
        } else {
          console.error(
            `Invalid coordinate at index ${index}: lat or lng is not a number`,
            coord
          );
          return "Invalid coordinate";
        }
      } else {
        console.error(`Invalid coordinate at index ${index}:`, coord);
        return "Invalid coordinate";
      }
    })
    .join("<br />");
};

/**
 * Formats a list of coordinates into a readable string.
 * @param coords - An array of coordinates.
 * @returns A formatted string of the coordinates.
 */
export const formatCoordinates = (coords: L.LatLngExpression[]): string => {
  if (!Array.isArray(coords)) {
    console.error("Invalid coordinates: coords is not an array", coords);
    return "Invalid coordinates";
  }

  return coords
    .map((coord, index) => {
      if (
        coord &&
        typeof coord === "object" &&
        "lat" in coord &&
        "lng" in coord
      ) {
        if (typeof coord.lat === "number" && typeof coord.lng === "number") {
          return `Lat: ${coord.lat.toFixed(4)}, Lng: ${coord.lng.toFixed(4)}`;
        } else {
          console.error(
            `Invalid coordinate at index ${index}: lat or lng is not a number`,
            coord
          );
          return "Invalid coordinate";
        }
      } else {
        console.error(`Invalid coordinate at index ${index}:`, coord);
        return "Invalid coordinate";
      }
    })
    .join("<br />");
};
