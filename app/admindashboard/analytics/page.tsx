"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Upload, Users } from "lucide-react"
import { RoleCard } from "@/app/components/RoleCard"
import { MyResponsiveBar } from "@/app/components/MyResponsiveBar"
import { MyResponsivePie } from "@/app/components/MyResponsivePie"
import { AnalyticsSidebar } from "@/app/components/AnalyticsSidebar"

interface UserStats {
  totalUsers: number;
  totalSVGs: number;
  adminName: string;
  adminEmail: string;
  adminImage: string;
}

export default function analytics(){
    const [stats, setStats] = useState<UserStats>({
        totalUsers: 0,
        totalSVGs: 0,
        adminName: "Admin User",
        adminEmail: "admin@example.com",
        adminImage: "/default.svg"
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get("/api/v1/users/stats");
                setStats(prev => ({
                    ...prev,
                    totalUsers: response.data.totalUsers,
                    totalSVGs: response.data.totalSVGs
                }));
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="flex h-screen bg-gray-50">
            <AnalyticsSidebar 
                totalUsers={stats.totalUsers}
                totalSVGs={stats.totalSVGs}
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
                            role="Editor" 
                            value={stats.totalUsers} 
                            Icon={Users} 
                            color="blue"
                        />   
                        <RoleCard 
                            role="Viewer" 
                            value={stats.totalSVGs} 
                            Icon={Upload} 
                            color="green"
                        />           
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Shape Distribution</h2>
                            <div className="h-[400px]">
                                <MyResponsivePie data={data}/>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">User Activity</h2>
                            <div className="h-[400px]">
                                <MyResponsiveBar data2={data2}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const data = [
    {
      "id": "Rectangle",
      "label": "Rectangles",
      "value": 45,
      "color": "hsl(271, 70%, 50%)"
    },
    {
      "id": "Circle",
      "label": "Circles",
      "value": 32,
      "color": "hsl(69, 70%, 50%)"
    },
    {
      "id": "Polygon",
      "label": "Polygons",
      "value": 28,
      "color": "hsl(121, 70%, 50%)"
    },
    {
      "id": "Polyline",
      "label": "Polylines",
      "value": 15,
      "color": "hsl(102, 70%, 50%)"
    }
]

const data2 = [
    {
      "role": "Editor",
      "total": 45,
      "active": 32,
      "inactive": 13
    },
    {
      "role": "Viewer",
      "total": 28,
      "active": 20,
      "inactive": 8
    }
]