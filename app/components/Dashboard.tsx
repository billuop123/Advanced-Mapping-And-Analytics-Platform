import React, { useState } from "react";
import { useLocationContext } from "../contexts/LocationContext";
import { usePosition } from "../contexts/PositionContext";
import axios from "axios";
import UserInfo from "./UserInfo";
import { useUser } from "../contexts/LoginContext";
import { useRole } from "../contexts/RoleContext";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HiArrowLongRight } from "react-icons/hi2";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Info } from "lucide-react";

const Dashboard = () => {
  const [type, setType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const { addLocation } = useLocationContext();
  const { setPosition, position } = usePosition();
  const [showDashboard, setShowDashboard] = useState<boolean>(true);
  const { email } = useUser();
  const { role } = useRole();
  
  const typeOptions = [
    { id: 1, name: "Hospital" },
    { id: 2, name: "Temple" },
    { id: 3, name: "School" },
    { id: 4, name: "Mall" },
    { id: 5, name: "Park" },
    { id: 6, name: "Others" },
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newLocation = {
      latitude: parseFloat(position[0].toFixed(14)),
      longitude: parseFloat(position[1].toFixed(14)),
      type: type || "Others",
      description,
    };

    try {
      await axios.post("http://localhost:3001/api/v1/marker/createMarker", {
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
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-blue-700">
                Location Dashboard
              </CardTitle>
              <CardDescription>
                Add new locations to the map
              </CardDescription>
            </div>
            <MapPin className="h-8 w-8 text-blue-500" />
          </div>
          
          {role === "admin" && (
            <Link 
              href="/admindashboard" 
              className="flex items-center justify-center gap-2 p-2 mt-2 text-blue-600 hover:text-blue-800 font-medium rounded-md hover:bg-blue-50 transition-all"
            >
              Admin Dashboard <HiArrowLongRight className="h-5 w-5" />
            </Link>
          )}
        </CardHeader>
        
        {showDashboard && (
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                    placeholder="Enter latitude"
                    className="focus-visible:ring-blue-500"
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
                    placeholder="Enter longitude"
                    className="focus-visible:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="font-medium">
                  Location Type
                </Label>
                <Select 
                  value={type} 
                  onValueChange={setType}
                  required
                >
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((option) => (
                      <SelectItem key={option.id} value={option.name}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter location details"
                  className="resize-none focus-visible:ring-blue-500"
                  rows={3}
                  required
                />
              </div>

              <Button 
                type="submit" 
                disabled={role === "viewer"}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {role === "viewer" ? "Viewer Mode (Read Only)" : "Add Location"}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-blue-500" />
                <h3 className="font-medium text-gray-700">User Information</h3>
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