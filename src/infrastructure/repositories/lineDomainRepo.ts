import { prisma } from "@/app/services/prismaClient";
import { LineRepository } from "@/src/domain/repositories/lineDomainRepo";
import { LatLng } from "leaflet";
import { NextResponse } from "next/server";

export class LineRepositoryImpl implements LineRepository {
    async createLine(userId: number, coords: LatLng[]): Promise<Response> {
    const roundTo10DecimalPlaces = (num:Number) => {
            return parseFloat(num.toFixed(10));
          };
    const roundedCoords = coords.map((coord:any) => ({
        lat: roundTo10DecimalPlaces(coord.lat),
        lng: roundTo10DecimalPlaces(coord.lng),
      }));
    
      const shape = await prisma.shape.create({
        data: {
          type: "POLYLINE",
          userId: userId,
          polyline: {
            create: {
              coords: roundedCoords, 
            },
          },
        },
        include: {
          polyline: true, 
        },
      });
  
      return NextResponse.json(shape, { status: 201 });
    
    }
    async getLine(userId: number): Promise<Response> {
      const admins = await prisma.user.findMany({ where: { role: "admin" } });
    const adminIds = admins.map((admin) => admin.id);

    // Fetch polylines for the user and admins
    const polylines = await prisma.polyline.findMany({
      where: {
        shape: {
          userId: { in: [...adminIds, userId] }, // Get both user & admin shapes
        },
      },
      include: { shape: true },
    });

    // Format response
    const formattedPolylines = polylines.map((polyline) => ({
      coords: polyline.coords,
    }));

    return NextResponse.json(formattedPolylines, { status: 200 });
    }
    async deleteSingleLine(userId: number, coords: LatLng[]): Promise<Response> {
      const roundTo10DecimalPlaces = (num:Number) => {
        return parseFloat(num.toFixed(10));
      }; 
      const roundedCoords = coords.map((coord:any) => ({
        lat: roundTo10DecimalPlaces(coord.lat),
        lng: roundTo10DecimalPlaces(coord.lng),
      }));
      const polylines = await prisma.polyline.findMany({
        where: {
          shape: {
            userId: userId,
          },
        },
      });
  
      const polyline = polylines.find((line) => {
        if (!line.coords) return false;
        const dbCoords = (line.coords as any[]).map((coord) => ({
          lat: roundTo10DecimalPlaces(coord.lat),
          lng: roundTo10DecimalPlaces(coord.lng),
        }));
        return JSON.stringify(dbCoords) === JSON.stringify(roundedCoords);
      });
  
      if (!polyline) {
        return NextResponse.json({
          error: "Polyline with the specified coordinates not found",
        }, { status: 404 });
      }
  
      await prisma.polyline.delete({
        where: {
          id: polyline.id,
        },
      });
  
      return new NextResponse(null, { status: 204 });
    }
}