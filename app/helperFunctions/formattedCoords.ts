import L from "leaflet";

/**
 * Formats the coordinates of a rectangle (L.Bounds) into a readable string.
 * @param coords - The bounds of the rectangle.
 * @returns A formatted string representing the southwest and northeast corners.
 */
export const formatCoordinatesRectangle = (coords: L.LatLngBounds): string => {
  //@ts-ignore
  if (coords && coords._southWest && coords._northEast) {
    //@ts-ignore
    const { lat: lat1, lng: lng1 } = coords._southWest;
    //@ts-ignore
    const { lat: lat2, lng: lng2 } = coords._northEast;
    return `SouthWest: Lat: ${lat1.toFixed(4)}, Lng: ${lng1.toFixed(
      4
    )}<br />NorthEast: Lat: ${lat2.toFixed(4)}, Lng: ${lng2.toFixed(4)}`;
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
