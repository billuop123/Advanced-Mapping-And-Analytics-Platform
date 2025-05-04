"use client";
import { useRole } from "@/app/contexts/RoleContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import SelectFilter from "@/app/components/SelectFilter";
import CirclesView from "@/app/helperFunctions/AdminDashboard/CirclesView";
import LinesView from "@/app/helperFunctions/AdminDashboard/LinesView";
import PolygonsView from "@/app/helperFunctions/AdminDashboard/PolygonsView";
import RectangleView from "@/app/helperFunctions/AdminDashboard/RectangleView";
import { ApiResponse } from "@/app/helperFunctions/interfacesAdminDashboard";
import { API_ENDPOINTS } from "@/src/config/api";
import { toast } from "sonner";

const GeometryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [shapeToDelete, setShapeToDelete] = useState<number | null>(null);
  const [selectedShapeType, setSelectedShapeType] = useState<string>("ALL");
  const session = useSession();
  const { role } = useRole();
  const router = useRouter();

  const handleViewShape = (shapeId: number) => {
    window.open(`/admindashboard/newMap?shapeId=${shapeId}`, '_blank');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const response = await axios.get(
          `${API_ENDPOINTS.USER.EDITING(id)}`
        );
        setData(response.data);
      } catch (err) {
        const errorMessage = err instanceof Error   
          ? err.message
          : "An error occurred while fetching data";
        setError(errorMessage);
        setIsErrorDialogOpen(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    if (!role) return;
    if (role != "admin") {
      window.location.href = "/";
    }
  }, [role]);

  useEffect(() => {
   if(!session.data) return;
    if (!session.data!.user.id) return;
    
    async function fetchVerificationResponse() {
      try {
        const response = await axios.post(  `${API_ENDPOINTS.USER.IS_VERIFIED}`, {
          userId: session.data!.user.id
        });
        
        if (response.data && typeof response.data.isVerified === 'boolean') {
          if (!response.data.isVerified) {
            router.push("/sendEmailVerification");
          }
        }
      } catch (error) {
        console.error("Error checking verification status:", error);
      }
    }

    fetchVerificationResponse();
  }, [router]);

  const handleDelete = async (shapeId: number | undefined) => {
    if (!shapeId) return;
    try {
      await axios.delete(
        `${API_ENDPOINTS.SHAPES.DELETE_BY_ID(shapeId.toString())}`
      );
      setData((prevData) => ({
        polygonInfo:
          prevData?.polygonInfo.filter((shape) => shape.id !== shapeId) || [],
      }));
      setDeleteConfirmOpen(false);
      setShapeToDelete(null);
      toast("Shape successfully deleted")
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : "An error occurred while deleting the shape";
      setError(errorMessage);
      setIsErrorDialogOpen(true);
    }
  };

  const openDeleteConfirm = (shapeId: number) => {
    setShapeToDelete(shapeId);
    setDeleteConfirmOpen(true);
  };

  const shapeCounts = {
    RECTANGLE: 0,
    CIRCLE: 0,
    POLYGON: 0,
    POLYLINE: 0,
  };

  if (data) {
    data.polygonInfo.forEach((shape) => {
      if (shape.polygon || shape.rectangle || shape.circle || shape.polyline) {
        shapeCounts[shape.type] += 1;
      }
    });
  }

  const filteredShapes = data?.polygonInfo.filter((shape) => {
    if (selectedShapeType === "ALL") return true;
    return shape.type === selectedShapeType;
  });

  const rectangles = filteredShapes?.filter(
    (shape) => shape.type === "RECTANGLE" && shape.rectangle
  );
  const circles = filteredShapes?.filter(
    (shape) => shape.type === "CIRCLE" && shape.circle
  );
  const polygons = filteredShapes?.filter(
    (shape) => shape.type === "POLYGON" && shape.polygon
  );
  const lines = filteredShapes?.filter(
    (shape) => shape.type === "POLYLINE" && shape.polyline
  );

  const hasShapes =
    (rectangles && rectangles.length > 0) ||
    (circles && circles.length > 0) ||
    (polygons && polygons.length > 0) ||
    (lines && lines.length > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">No data available</div>
      </div>
    );
  }

  if (data.polygonInfo.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">No shapes found for this user.</div>
      </div>
    );
  }
 
  return (
    <>
      <div className="container mx-auto p-4">
        <div className="mb-4 flex items-center justify-between">
          <SelectFilter selectedShapeType={selectedShapeType} setSelectedShapeType={setSelectedShapeType} />
        </div>

        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this shape? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setShapeToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(shapeToDelete!)}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Error</DialogTitle>
              <DialogDescription>{error}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setIsErrorDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="p-6 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-foreground">Geometry Information Display</h1>

          <section className="mb-8 bg-card border border-border p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-foreground">User Information</h2>
            <div className="flex items-center gap-4">
              <Image
                width={12}
                height={12}
                src={data.polygonInfo[0].user.image}
                alt={data.polygonInfo[0].user.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-medium text-foreground">{data.polygonInfo[0].user.name}</p>
                <p className="text-muted-foreground">{data.polygonInfo[0].user.email}</p>
                <p className="text-muted-foreground">
                  Role: {data.polygonInfo[0].user.role}
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8 bg-card border border-border p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Shape Distribution</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(shapeCounts).map(([type, count]) => (
                <div key={type} className="bg-muted/50 p-4 rounded">
                  <h3 className="font-medium text-foreground">{type}</h3>
                  <p className="text-2xl font-bold text-foreground">{count}</p>
                </div>
              ))}
            </div>
          </section>

          {hasShapes && (
            <section className="bg-card border border-border p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-foreground">
                Detailed Shape Information
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    <RectangleView rectangles={rectangles} handleViewShape={handleViewShape} openDeleteConfirm={openDeleteConfirm} />
                    <CirclesView circles={circles} handleViewShape={handleViewShape} openDeleteConfirm={openDeleteConfirm} />
                    <PolygonsView polygons={polygons} handleViewShape={handleViewShape} openDeleteConfirm={openDeleteConfirm} />
                    <LinesView lines={lines} handleViewShape={handleViewShape} openDeleteConfirm={openDeleteConfirm} />
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default GeometryPage;