"use client";
import { useMap } from "react-leaflet";
interface ChangeCenterProps {
  pos: [number, number];
}

const ChangeCenter: React.FC<ChangeCenterProps> = ({ pos }) => {
  const map = useMap();
  map.setView(pos);
  return null;
};

export default ChangeCenter;
