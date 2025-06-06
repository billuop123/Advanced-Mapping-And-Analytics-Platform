"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { HiArrowLongRight } from "react-icons/hi2";
import { useLocationContext } from "../contexts/LocationContext";
import { useUser } from "../contexts/LoginContext";
import { usePosition } from "../contexts/PositionContext";
import { useRole } from "../contexts/RoleContext";
import UserInfo from "./UserInfo";

import { Textarea } from "@/components/ui/textarea";
import { API_ENDPOINTS } from "@/src/config/api";
import { Info, MapPin } from "lucide-react";

const Dashboard = () => {
  const [type, setType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const { addLocation } = useLocationContext();
  const { setPosition, position } = usePosition();
  const [showDashboard, setShowDashboard] = useState<boolean>(true);
  const { email } = useUser();
  const { role } = useRole();
  const [typeOptions, setTypeOptions] = useState<{ id: number; name: string; icon: string }[]>([
       { id: 100, name: "Hospital", icon: "/hospital.svg" },
       { id: 200, name: "Temple", icon: "/temple.svg" },
       { id: 300, name: "School", icon: "/school.svg" },
       { id: 400, name: "Mall", icon: "/mall.svg" },
       { id: 500, name: "Park", icon: "/park.svg" },
       { id: 600, name: "Others", icon: "/Others.svg" },
     ]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newLocation = {
      latitude: parseFloat(position[0].toFixed(14)),
      longitude: parseFloat(position[1].toFixed(14)),
      type: type || "Others",
      description,
    };

    try {
      await axios.post(API_ENDPOINTS.MARKERS.CREATE, {
        newLocation,
        email,
      });
      addLocation(newLocation);
      setDescription("");
      setType("");
    } catch (error) {
      console.error("Error creating marker:", error);
    }
  };
  
  useEffect(() => {
    const fetchSVGs = async () => {
      const response = await axios.get(API_ENDPOINTS.SVG.GET);
      setTypeOptions([...typeOptions,...response.data]);
    };
    fetchSVGs();
  }, []);
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-lg border border-border" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
        <CardHeader className="bg-muted/50 rounded-t-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-primary">
                Location Dashboard
              </CardTitle>
              <CardDescription className="text-primary/80 mt-1">
                Add new locations to the map
              </CardDescription>
            </div>
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          
         
        </CardHeader>
        
        {showDashboard && (
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="latitude" className="font-medium">
                    Latitude
                  </Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={position[0]}
                    onChange={(e) => setPosition([Number(e.target.value), position[1]])}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    placeholder="Enter latitude"
                    className="focus-visible:ring-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude" className="font-medium">
                    Longitude
                  </Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={position[1]}
                    onChange={(e) => setPosition([position[0], Number(e.target.value)])}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    placeholder="Enter longitude"
                    className="focus-visible:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <Label htmlFor="type" className="font-medium w-32">
                    Location Type
                  </Label>
                  <div className="flex-1 relative">
                    <select
                      id="type"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className={`w-full pl-10 pr-10 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background ${role === "viewer" ? "opacity-70 cursor-not-allowed" : "cursor-pointer"} appearance-none`}
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                    >
                      <option value="">{role === "viewer" ? "Viewer Mode" : "Select a type"}</option>
                      {typeOptions.map((option) => (
                        <option key={option.id} value={option.name}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    {type && (
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <img 
                          src={typeOptions.find(opt => opt.name === type)?.icon || '/Others.svg'} 
                          alt={type}
                          className="h-4 w-4"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/Others.svg';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  placeholder="Enter location details"
                  className="resize-none focus-visible:ring-primary"
                  rows={3}
                  required
                />
              </div>

              <Button 
                type="submit" 
                disabled={role === "viewer"}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="w-full"
                variant="default"
              >
                {role === "viewer" ? "Viewer Mode" : "Add Location"}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-4 w-4 text-primary" />
                <h3 className="font-medium">User Information</h3>
              </div>
              <UserInfo />
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;