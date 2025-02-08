"use client";

import { useRouter } from "next/navigation";
import { useMapEvents } from "react-leaflet";
import { usePosition } from "../contexts/PositionContext";
import { useDrawing } from "../contexts/IsDrawingContext";

export const DetectClick: React.FC = () => {
  const router = useRouter();
  const { setPosition } = usePosition();
  const { isDrawing } = useDrawing();
  useMapEvents({
    click: (e) => {
      if (!isDrawing) {
        const { lat, lng } = e.latlng;
        router.push(`?lat=${lat}&lng=${lng}`);
        setPosition([lat, lng]);
      }
    },
  });

  return null;
};
