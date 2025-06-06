"use client"
import dynamic from "next/dynamic";
const LandingPage = dynamic(
  () => import("./pages/LandingPage"),
  { 
    ssr: false,
  }
);

export default function Some() {
  return (
    <div>
      <LandingPage />
    </div>
  );
}