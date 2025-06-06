"use client";

import { AnalyticsCard } from "@/app/components/AnalyticsCard";
import { MyResponsiveBar } from "@/app/components/MyResponsiveBar";
import { MyResponsivePie } from "@/app/components/MyResponsivePie";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { API_ENDPOINTS } from "@/src/config/api";
import axios from "axios";
import { BarChart3, Circle, Layers, Map, MapPin, Moon, Shield, Square, Sun, Users } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRole } from "../contexts/RoleContext";
import { HiArrowLongRight } from "react-icons/hi2";

const features = [
  {
    icon: <Map className="h-6 w-6" />,
    title: "Interactive Maps",
    description: "Explore and interact with detailed maps for better visualization and analysis."
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: "Multiple Layers",
    description: "Overlay different data layers to gain deeper insights into your geographical data."
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "User Management",
    description: "Comprehensive user management system with role-based access control."
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Secure Authentication",
    description: "Advanced security features including email verification and secure login."
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Analytics Dashboard",
    description: "Powerful analytics tools to track and analyze your data effectively."
  }
];

export default function LandingPage() {
  const { data: session, status } = useSession();
  const {role}=useRole()
  const [shapeData, setShapeData] = useState([
    { id: "Circles", value: 0, color: "hsl(120, 70%, 50%)" },
    { id: "Rectangles", value: 0, color: "hsl(240, 70%, 50%)" },
    { id: "Polygons", value: 0, color: "hsl(60, 70%, 50%)" },
    {id:"Polylines",value:0,color:"hsl(300, 70%, 50%)"}
  ]);
  const { theme, setTheme } = useTheme()
  const [pieData, setPieData] = useState<{ role: string; total: number }[]>([]);
  const [typeOptions, setTypeOptions] = useState<{ id: number; name: string; icon: string }[]>([
    { id: 100, name: "Hospital", icon: "/hospital.svg" },
    { id: 200, name: "Temple", icon: "/temple.svg" },
    { id: 300, name: "School", icon: "/school.svg" },
    { id: 400, name: "Mall", icon: "/mall.svg" },
    { id: 500, name: "Park", icon: "/park.svg" },
    { id: 600, name: "Others", icon: "/Others.svg" },
  ]);
  const [locationData, setLocationData] = useState([
    { type: "Hospital", total: 0 },
    { type: "Temple", total: 0 },
    { type: "School", total: 0 },
    { type: "Mall", total: 0 },
    { type: "Park", total: 0 },
    { type: "Others", total: 0 }
  ]);
  const [totalLocations, setTotalLocations] = useState(0);

  useEffect(() => {
    if(!session)return 
    const fetchSVGs = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.SVG.GET);
        setTypeOptions([...typeOptions, ...response.data]);
      } catch (error) {
        console.error("Error fetching SVGs:", error);
      }
    };
    fetchSVGs();
  }, [session]);
useEffect(()=>{
  const pieData = locationData.map(location => ({
    role: location.type,
    total: location.total
  }));
  setPieData(pieData);
},[locationData])
  useEffect(() => {
    if (!session) return;

    const fetchData = async () => {
      try {
        const response = await axios.get("/api/v1/users/singleStats");
        const shapes = response.data.shapes;
        
        const shapeCounts = shapes.reduce((acc: any, shape: any) => {
          const type = shape.type.toLowerCase();
          if (type === 'circle') acc.circles++;
          else if (type === 'rectangle') acc.rectangles++;
          else if (type === 'polygon') acc.polygons++;
          else if (type === 'polyline') acc.polylines++;
          return acc;
        }, { circles: 0, rectangles: 0, polygons: 0, polylines: 0 });

        setShapeData([
          { id: "Circles", value: shapeCounts.circles, color: "hsl(120, 70%, 50%)" },
          { id: "Rectangles", value: shapeCounts.rectangles, color: "hsl(240, 70%, 50%)" },
          { id: "Polygons", value: shapeCounts.polygons, color: "hsl(60, 70%, 50%)" },
          { id: "Polylines", value: shapeCounts.polylines, color: "hsl(300, 70%, 50%)" }
        ]);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchData();
  }, [session]);

  useEffect(() => {
    if (!session) return;

    const fetchLocationData = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.LOCATION.GET);
        const locations = response.data.locations;
       
  
        setTotalLocations(locations.length);
        

        const typeMap = Object.fromEntries(typeOptions.map(option => [option.id, option.name])) as Record<number, string>;
        
 
        const newLocationData = typeOptions.map(option => {
          const count = locations.filter((location: any) => {
            const typeName = typeMap[location.type] ;
            return typeName === option.name;
          }).length;
          return {
            type: option.name,
            total: count
          };
        });

      
        locations.forEach((location: any) => {
          newLocationData.map((item: any) => {
  
            if (item.type === location.type) {
              item.total++;
            }
          });
        });
        setLocationData(newLocationData);
        console.log(newLocationData);
      } catch (error) {
        console.error("Error fetching location stats:", error);
      }
    };
    fetchLocationData();
  }, [session, typeOptions]);

  // Calculate total shapes
  const totalShapes = shapeData.reduce((acc, shape) => acc + shape.value, 0);

  const isLoading = status === "loading";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Button size="lg" disabled>
          Loading...
        </Button>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative">
          <div 
            className="absolute inset-0 bg-cover bg-center z-0" 
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1474&auto=format&fit=crop')",
            }}
          >
            <div className="absolute inset-0 bg-black/60"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block">Advanced Mapping</span>
                <span className="block text-blue-400">and Analytics Platform</span>
              </h1>
              <p className="mt-6 text-xl text-gray-200 max-w-3xl mx-auto">
                A powerful platform for geographical data visualization, analysis, and management.
                Perfect for businesses and organizations that need to make data-driven decisions.
              </p>
              <div className="mt-10 flex justify-center gap-4">
                <Link href="/api/auth/signin">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Sign In
                  </Button>
                </Link>
                <Link href="/api/auth/signup">
                  <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
                Platform Features
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need to manage and analyze your geographical data
              </p>
            </div>

            <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow bg-card">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg text-blue-600 dark:bg-blue-400 dark:text-blue-300">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-foreground">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
  
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1474&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">Welcome back,</span>
              <span className="block text-blue-400">{session.user?.name}</span>
            </h1>
            <p className="mt-6 text-xl text-gray-200 max-w-3xl mx-auto">
              Access your maps, analytics, and manage your data.
            </p>
            <div className="mt-10 flex justify-center gap-4">
            

{role === "admin" && (
  <Link href="/admindashboard/analytics">
    <Button 
      size="lg" 
      variant="outline" 
      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
    >
      <Shield className="h-5 w-5" />
      Admin Dashboard
      <HiArrowLongRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
    </Button>
  </Link>
)}  
              <Link href="/map"  target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white dark:text-white">
                  Go to Map
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Overview Section */}
      <div className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
              Map Analytics
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Insights into map shapes and location distribution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <AnalyticsCard 
              title="Total Shapes" 
              value={totalShapes} 
              Icon={MapPin} 
              color="blue" 
            />
            <AnalyticsCard 
              title="Locations" 
              value={totalLocations} 
              Icon={Circle} 
              color="green" 
            />
            <AnalyticsCard 
              title="Shape Types" 
              value={shapeData.filter(shape => shape.value > 0).length} 
              Icon={Square} 
              color="purple" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            <Card className="p-6 bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Shape Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <MyResponsivePie data={shapeData} />
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Location Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <MyResponsiveBar data2={pieData} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="py-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center gap-4">
          <Button
            onClick={() => signOut()}
            size="lg"
            variant="outline"
            className="border-border hover:bg-accent"
          >
            Logout
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem 
                onClick={() => setTheme("light")}
                className="cursor-pointer hover:bg-accent focus:bg-accent"
              >
                Light
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setTheme("dark")}
                className="cursor-pointer hover:bg-accent focus:bg-accent"
              >
                Dark
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}