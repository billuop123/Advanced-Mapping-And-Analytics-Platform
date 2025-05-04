"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Eye, PencilOff, Upload, Users } from "lucide-react"
import { RoleCard } from "@/app/components/RoleCard"
import { MyResponsiveBar } from "@/app/components/MyResponsiveBar"
import { MyResponsivePie } from "@/app/components/MyResponsivePie"
import { AnalyticsSidebar } from "@/app/components/AnalyticsSidebar"
import { useRole } from "@/app/contexts/RoleContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UserStats {
  totalUsers: number;
  totalSVGs: number;
  adminName: string;
  adminEmail: string;
  adminImage: string;
  totalRectangles: number;
  totalCircles: number;
  totalLines: number;
  totalPolygons: number;
  editorUsers: number;
  viewerUsers: number;
}

export default function analytics(){
    const [stats, setStats] = useState<UserStats>({
        totalUsers: 0,
        totalSVGs: 0,
        totalRectangles: 0,
        totalCircles: 0,
        totalLines: 0,
        totalPolygons: 0,
        adminName: "Admin User",
        adminEmail: "admin@example.com",
        adminImage: "/default.svg",
        editorUsers: 0,
        viewerUsers: 0
    });
    const {role} = useRole()
    
    useEffect(() => {
        if(!role) return
        if(role !== "admin") {
            window.location.href = "/"
        }
    }, [role])
    
    const data = [
        {
          "id": "Rectangle",
          "label": "Rectangles",
          "value": stats.totalRectangles,
          "color": "hsl(271, 70%, 50%)"
        },
        {
          "id": "Circle",
          "label": "Circles",
          "value": stats.totalCircles,
          "color": "hsl(69, 70%, 50%)"
        },
        {
          "id": "Polygon",
          "label": "Polygons",
          "value": stats.totalPolygons,
          "color": "hsl(121, 70%, 50%)"
        },
        {
          "id": "Polyline",
          "label": "Polylines",
          "value": stats.totalLines,
          "color": "hsl(102, 70%, 50%)"
        }
    ]
    
    const data2 = [
        {
          "role": "Editor",
          "total": stats.editorUsers,
        },
        {
          "role": "Viewer",
          "total": stats.viewerUsers,
        }
    ]
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get("/api/v1/users/stats");
                setStats(prev => ({
                    ...prev,
                    totalUsers: response.data.totalUsers,
                    totalSVGs: response.data.totalSVGs,
                    totalRectangles: response.data.totalRectangles,
                    totalCircles: response.data.totalCircles,
                    totalLines: response.data.totalLines,
                    totalPolygons: response.data.totalPolygons,
                    adminName: response.data.adminName,
                    adminEmail: response.data.adminEmail,
                    adminImage: response.data.adminImage,
                    editorUsers: response.data.editorUsers,
                    viewerUsers: response.data.viewerUsers
                }));
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="flex h-screen bg-background">
            <AnalyticsSidebar 
                totalUsers={stats.editorUsers + stats.viewerUsers}
                totalSVGs={stats.totalSVGs + 6}
                adminName={stats.adminName}
                adminEmail={stats.adminEmail}
                adminImage={stats.adminImage}
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <div className={`flex-1 overflow-auto transition-all duration-300 ${isSidebarOpen ? 'ml-80' : 'ml-20'}`}>
                <div className="p-6 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <RoleCard 
                            role="Editors" 
                            value={stats.editorUsers} 
                            Icon={PencilOff} 
                            color="blue"
                        />   
                        <RoleCard 
                            role="Viewers" 
                            value={stats.viewerUsers} 
                            Icon={Eye} 
                            color="green"
                        />           
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Shape Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[400px]">
                                    <MyResponsivePie data={data}/>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>Total Editor vs Total Viewer</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[400px]">
                                    <MyResponsiveBar data2={data2}/>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}