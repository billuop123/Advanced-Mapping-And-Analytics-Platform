import { EditControl } from "react-leaflet-draw";
import { customIcon } from "../api/config";
import { useDrawing } from "../contexts/IsDrawingContext";
import { useUser } from "../contexts/LoginContext";
import { useShapes } from "../contexts/shapeContext";
import { _created } from "./CreatedShape";
import { useEditedDebounced } from "./EditedShape";
import L from "leaflet";

export const EditControls = function ({ featureGroupRef}) {
  const { isDrawing } = useDrawing();
  const { shapes, setShapes } = useShapes();
  const { email } = useUser();

  // Call the hook at the top level
  const handleEdited = useEditedDebounced(featureGroupRef);

  const editStart = function () {
    console.log("editStart called");

    const popupContents: popupContentStyle[] = [];
    if (featureGroupRef.current) {
      featureGroupRef.current.eachLayer((layer: L.Layer) => {
        if (layer.getPopup()) {
          popupContents.push({
            layer: layer,
            content: layer.getPopup()!.getContent(),
          });
        }
      });

      if (featureGroupRef.current) {
        featureGroupRef.current.clearLayers();
      }
    }

    if (shapes) {
      shapes.rectangles.forEach((bounds) => {
        const rectangle = L.rectangle(bounds, { color: "purple" });
        if (!featureGroupRef.current) {
          return;
        }
        rectangle.addTo(featureGroupRef.current);
      });

      shapes.polygons.forEach((coords) => {
        const polygon = L.polygon(coords, { color: "blue" });
        if (!featureGroupRef.current) return;
        polygon.addTo(featureGroupRef.current);
      });

      shapes.circles.forEach((circle) => {
        const circleLayer = L.circle(circle.center, {
          radius: circle.radius,
          color: "green",
        });
        if (!featureGroupRef.current) return;
        circleLayer.addTo(featureGroupRef.current);
      });

      shapes.polylines.forEach((coords) => {
        const polyline = L.polyline(coords, { color: "red" });
        if (!featureGroupRef.current) return;
        polyline.addTo(featureGroupRef.current);
      });
    }

    popupContents.forEach(({ layer, content }) => {
      if (!layer) return;
      layer.bindPopup(content).openPopup();
    });
  };

  return (
    <EditControl
      position="topright"
      draw={{
        polygon: true,
        polyline: true,
        circle: true,
        rectangle: true,
        marker: {
          icon: customIcon,
        },
      }}
      onDrawStart={(e) => {
        console.log("onDrawStart Event:", e);
        if (e.layerType === "marker") {
          console.log("Marker drawing started");
        }
        isDrawing.current = true;
      }}
      onDrawStop={() => {
        isDrawing.current = false;
      }}
      onCreated={(e) => {
        if (e.layerType === "marker") {
        }
        _created(e, email, setShapes);
      }}
      onDeleteStart={() => {
        isDrawing.current = true;
      }}
      onDeleteStop={() => {
        isDrawing.current = false;
      }}
      onEdited={handleEdited} // Pass the function returned by the hook
      onEditStart={editStart}
    />
  );
};
