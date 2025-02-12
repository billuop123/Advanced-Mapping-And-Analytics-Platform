export const formatCoordinatesRectangle = (coords) => {
  if (coords && coords._southWest && coords._northEast) {
    const { lat: lat1, lng: lng1 } = coords._southWest;
    const { lat: lat2, lng: lng2 } = coords._northEast;
    return `SouthWest: Lat: ${lat1.toFixed(4)}, Lng: ${lng1.toFixed(
      4
    )}<br />NorthEast: Lat: ${lat2.toFixed(4)}, Lng: ${lng2.toFixed(4)}`;
  }

  if (Array.isArray(coords)) {
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
  }

  console.error("Invalid coordinates:", coords);
  return "Invalid coordinates";
};

export const formatCoordinatesPolygon = (coords) => {
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
export const formatCoordinates = (coords) => {
  if (!Array.isArray(coords)) {
    console.error("Invalid coordinates: coords is not an array", coords);
    return "Invalid coordinates";
  }

  return coords
    .map((coord, index) => {
      if (
        coord &&
        typeof coord.lat === "number" &&
        typeof coord.lng === "number"
      ) {
        return `Lat: ${coord.lat.toFixed(4)}, Lng: ${coord.lng.toFixed(4)}`;
      } else {
        console.log(`Invalid coordinate at index ${index}:`, coord);
      }
    })
    .join("<br />");
};
