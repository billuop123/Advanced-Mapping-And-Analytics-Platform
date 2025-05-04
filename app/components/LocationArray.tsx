import React, { useEffect } from "react";
import { Marker, Popup } from "react-leaflet";
import { customIconFunction } from "../api/config";
import { useLocationContext } from "../contexts/LocationContext";
import axios from "axios";
import { useUser } from "../contexts/LoginContext";
import { API_ENDPOINTS } from "@/src/config/api";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export const LocationArray = () => {
  const { allLocationArray, setAllLocationArray } = useLocationContext();
  const { email } = useUser();
  const { theme } = useTheme();

  const handleDeleteMarker = async (latitude: number, longitude: number) => {
    try {
      await axios.post(`${API_ENDPOINTS.MARKERS.DELETE}`, {
        email,
        coordinates: {
          lat: latitude,
          lng: longitude,
        },
      });
    } catch (err) {
      console.log(err);
    }
    setAllLocationArray((prev) =>
      prev.filter(
        (location) =>
          location.latitude !== latitude || location.longitude !== longitude
      )
    );
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.innerHTML = `
        .leaflet-popup-content-wrapper {
          background-color: ${theme === 'dark' ? 'hsl(224, 71%, 4%)' : 'white'};
          color: ${theme === 'dark' ? 'white' : 'black'};
          border-radius: 0.5rem;
          border: 1px solid ${theme === 'dark' ? 'hsl(215, 27%, 25%)' : 'hsl(215, 27%, 90%)'};
          box-shadow: 0 4px 12px rgba(0, 0, 0, ${theme === 'dark' ? '0.5' : '0.1'});
        }
        .leaflet-popup-tip {
          background-color: ${theme === 'dark' ? 'hsl(224, 71%, 4%)' : 'white'};
          border: 1px solid ${theme === 'dark' ? 'hsl(215, 27%, 25%)' : 'hsl(215, 27%, 90%)'};
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [theme]);

  return allLocationArray.map((location, index) => (
    <Marker
      key={index}
      position={[location.latitude, location.longitude]}
      icon={customIconFunction(location.type)}
    >
      <Popup closeButton={false}>
        <div className="p-2 min-w-[180px] h-[120px]">
          <div className="mb-2">
            <h3 className="font-medium text-foreground text-sm mb-1">{location.description}</h3>
            <div className="text-xs text-muted-foreground">
              <div className="">
                <span className="font-semibold text-black">Type:</span> {location.type}
              </div>
              <div className="">
                <span className="font-semibold text-black">Lat:</span> {parseFloat(location.latitude.toString()).toFixed(6)}
              </div>
              <div>
                <span className="font-semibold text-black">Lng:</span> {parseFloat(location.longitude.toString()).toFixed(6)}
              </div>
            </div>  
          </div>
          <Button 
            variant="destructive"
            size="sm"
            className="w-full mt-1 text-xs h-7"
            onClick={() => {
              handleDeleteMarker(location.latitude, location.longitude);
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
            Delete
          </Button>
        </div>
      </Popup>
    </Marker>
  ));
};