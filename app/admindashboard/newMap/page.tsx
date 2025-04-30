"use client";
import MapView from "@/app/components/MapView";
import { API_ENDPOINTS } from "@/src/config/api";
import axios from "axios";
import { useEffect, useState } from "react";


export default function NewMapPage() {
  const [shapeCoords, setShapeCoords] = useState(null);
  const [shapeType, setShapeType] = useState("");
    useEffect(() => {
        if (!sessionStorage.getItem('hasReloaded')) {
          sessionStorage.setItem('hasReloaded', 'true');
          window.location.reload();
        }
        return () => {
          sessionStorage.removeItem('hasReloaded');
        };
      }, []);
      useEffect(()=>{
        async function fetchShape(){
          try {
            const shapeId = new URLSearchParams(window.location.search).get('shapeId');
            if (!shapeId) {
              console.error('No shape ID provided');
              return;
            }
            const response = await axios.get(`${API_ENDPOINTS.SHAPES.GET_BY_ID(shapeId)}`);
            if(response.data.type === "POLYGON"){
              setShapeCoords(response.data.polygon.coords); 
              setShapeType("polygon");
            }
            if(response.data.type === "POLYLINE"){
              setShapeCoords(response.data.polyline.coords);
              setShapeType("polyline");
            }
            if(response.data.type === "RECTANGLE"){
              setShapeCoords(response.data.rectangle);
              setShapeType("rectangle");
            }
            if(response.data.type === "CIRCLE"){
              setShapeCoords(response.data.circle);
              setShapeType("circle");
            }
          } catch (error) {
            console.error('Error fetching shape:', error);
          }
        }
        fetchShape();
      }, []);
  return (
    <div className="w-full h-screen">
      <MapView shapeCoords={shapeCoords} shapeType={shapeType} />
    </div>
  );
}