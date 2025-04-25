"use client";
import { useEffect, useRef, useState } from "react";
import MapClient from "../pages/MapClient"; // Your MapClient component
import Dashboard from "./Dashboard"; // Your Dashboard component
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { useUser } from "../contexts/LoginContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import L from "leaflet"
import axios from "axios";
import { LatLng, LatLngBounds, LatLngExpression } from "leaflet";
export type ShapesState = {
  polygons: LatLngExpression[][];
  circles: { center: LatLng; radius: number }[];
  polylines: LatLngExpression[][];
  rectangles: LatLngBounds[];
};
const initialShapes: ShapesState = {
  polygons: [],
  circles: [],
  polylines: [],
  rectangles: [],
};
const MapDashboardContainer = () => {
  const [isDashboardVisible, setIsDashboardVisible] = useState(false);
  const mapRef = useRef<{ handleResize: () => void } | null>(null);
  const { status, email } = useUser();
  const session = useSession();
  const router = useRouter(); 
  const toggleDashboard = () => {
    setIsDashboardVisible((prev) => !prev);
  };
    // const [shapes, setShapes] = useState<ShapesState>(initialShapes);
    // const [loading, setLoading] = useState<boolean>(false);
    // const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (status === "loading") return;
    if (!email) {
      router.push("/api/auth/signin");
    }
  }, [status, email, router]);

  useEffect(() => {
    const handlePopState = () => {
        window.location.reload();  
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
        window.removeEventListener("popstate", handlePopState);
    };
}, []);

  useEffect(() => {
    // Trigger a resize event on the map when the dashboard is toggled
    if (mapRef.current) {
      // Assuming MapClient has a method to handle resize
  
      if (typeof mapRef.current.handleResize === "function") {
        mapRef.current.handleResize();
      }
    }
  }, [isDashboardVisible]);

  useEffect(() => {
    if (!session.data?.user) return;
    async function fetchVerificationResponse() {
      const response = await axios.post("http://localhost:3001/api/v1/isVerified", {
        userId: session.data?.user.id
      });
      if (!response.data.isVerified) {
        router.push("/sendEmailVerification");
      }
    }
    fetchVerificationResponse();
  }, [session]);

  return (
    <div className="flex flex-row h-screen bg-white relative">
      {/* Arrow Icon (Center Left of Screen) */}
      {!isDashboardVisible && (
        <div
          className="fixed left-0 top-1/2 transform -translate-y-1/2 cursor-pointer bg-blue-600 p-3 rounded-r-lg shadow-lg hover:bg-blue-700 transition-all duration-200 z-[1000]"
          onClick={toggleDashboard}
        >
          <BiRightArrowAlt className="text-2xl text-white" />
        </div>
      )}

      {/* Dashboard Section (Left Side) */}
      <div
        className={`w-1/3 bg-white shadow-xl flex flex-col transition-all duration-300 ease-in-out transform ${
          isDashboardVisible ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ 
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 999
        }}
      >
        <div className="p-6 h-full overflow-y-auto">
        {isDashboardVisible && <Dashboard />}
        </div>

        {/* Arrow Icon (Middle Right of Dashboard) */}
        {isDashboardVisible && (
          <div
            className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer bg-blue-600 p-3 rounded-l-lg shadow-lg hover:bg-blue-700 transition-all duration-200"
            onClick={toggleDashboard}
          >
            <BiLeftArrowAlt className="text-2xl text-white" />
          </div>
        )}
      </div>

      {/* Map Section (Right Side) */}
      <div className={`flex-1 transition-all duration-300 ${isDashboardVisible ? "ml-[33.33%]" : ""}`}>
        <div className="h-full w-full">
          <MapClient ref={mapRef} />
        </div>
      </div>
    </div>
  );
};

export default MapDashboardContainer;