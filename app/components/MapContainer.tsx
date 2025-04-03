"use client";
import { useEffect, useRef, useState } from "react";
import MapClient from "../pages/MapClient"; // Your MapClient component
import Dashboard from "./Dashboard"; // Your Dashboard component
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { useUser } from "../contexts/LoginContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";

const MapDashboardContainer = () => {
  const [isDashboardVisible, setIsDashboardVisible] = useState(false);
  const mapRef = useRef<{ handleResize: () => void } | null>(null);
  const { status, email } = useUser();
  const session=useSession()
  const router=useRouter()
  // console.log(`---${session.data?.user.id}`)
  const toggleDashboard = () => {
    setIsDashboardVisible((prev) => !prev);
  };
  const Router = useRouter();
  useEffect(() => {
    console.log(status);
    if (status === "loading") return;
    if (!email) {
      Router.push("/api/auth/signin");
    }
  }, [status, email, Router]);
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
useEffect(
  
  ()=>{
  if(!session.data?.user)return;
  async function fetchVerificationResponse(){
    const response=await axios.post("http://localhost:3001/api/v1/isVerified",{
      userId:session.data?.user.id
    })
    if(!response.data.isVerified){
      router.push("/sendEmailVerification")
    }
  }
  fetchVerificationResponse()

},[session])
  return (
    <div className="flex flex-row h-screen bg-gray-100 relative">
      {/* Arrow Icon (Center Left of Screen) */}
      {!isDashboardVisible && (
        <div
          className="fixed left-0 top-1/2 transform -translate-y-1/2 cursor-pointer bg-white p-2 rounded-r-lg shadow-md z-[1000]"
          onClick={toggleDashboard}
        >
          <BiRightArrowAlt className="text-2xl text-gray-600 hover:text-blue-500" />
        </div>
      )}

      {/* Dashboard Section (Left Side) */}
      <div
        className={`w-1/3 p-4 bg-white shadow-lg flex flex-col transition-all duration-300 relative ${
          isDashboardVisible ? "block" : "hidden"
        }`}
        style={{ height: "100vh" }} // Set fixed height to fill the screen
      >
        {isDashboardVisible && <Dashboard />}

        {/* Arrow Icon (Middle Right of Dashboard) */}
        {isDashboardVisible && (
          <div
            className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer bg-white p-2 rounded-l-lg shadow-md"
            onClick={toggleDashboard}
          >
            <BiLeftArrowAlt className="text-2xl text-gray-600 hover:text-blue-500" />
          </div>
        )}
      </div>

      {/* Map Section (Right Side) */}
      <div className="flex-1 p-4 overflow-hidden transition-all duration-300">
        <div className="h-full w-full">
          <MapClient ref={mapRef} />
        </div>
      </div>
    </div>
  );
};

export default MapDashboardContainer;
