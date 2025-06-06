"use client";
import { useEffect, useRef, useState } from "react";
import MapClient from "./MapClient"; // Your MapClient component
import Dashboard from "../components/Dashboard"; // Your Dashboard component
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { useUser } from "../contexts/LoginContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { LatLng, LatLngBounds, LatLngExpression } from "leaflet";

export type ShapesState = {
  polygons: LatLngExpression[][];
  circles: { center: LatLng; radius: number }[];
  polylines: LatLngExpression[][];
  rectangles: LatLngBounds[];
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
  
  useEffect(() => {
    if (status === "loading") return;
    if (!email) {
      router.push("/api/auth/signin");
    }
  }, [status, email, router]);

  // useEffect(() => {
  //   const handlePopState = () => {
  //     if(typeof window !== "undefined"){
  //       window.location.reload();  
  //     }
  //   };

  //   window.addEventListener("popstate", handlePopState);

  //   return () => {
  //     if(typeof window !== "undefined"){
  //       window.removeEventListener("popstate", handlePopState);
  //     }
  //   };
  // }, []);

  useEffect(() => {
    if (mapRef.current) {
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
    <div className="flex flex-row h-screen bg-background relative">
      {/* Arrow Icon (Center Left of Screen) */}
      {!isDashboardVisible && (
        <div
          className="fixed left-0 top-1/2 transform -translate-y-1/2 cursor-pointer bg-primary p-3 rounded-r-lg shadow-lg hover:bg-primary/90 transition-all duration-200 z-[1000]"
          onClick={toggleDashboard}
        >
          <BiRightArrowAlt className="text-2xl text-primary-foreground" />
        </div>
      )}

      {/* Dashboard Section (Left Side) */}
      <div
        className={`w-1/3 bg-background border-r border-border shadow-xl flex flex-col transition-all duration-300 ease-in-out transform ${
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
            className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer bg-primary p-3 rounded-l-lg shadow-lg hover:bg-primary/90 transition-all duration-200"
            onClick={toggleDashboard}
          >
            <BiLeftArrowAlt className="text-2xl text-primary-foreground" />
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