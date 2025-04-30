import { prisma } from "@/app/services/prismaClient";
import { PolygonRepository } from "@/src/domain/repositories/polygonDomainRepo";
import { LatLng } from "leaflet";
import { NextResponse } from "next/server";

export class PolygonRepositoryImpl implements PolygonRepository {
    async createPolygon(userId: number, coords: LatLng[], type: string): Promise<Response> {
        let roundedCoords = coords.map((polygon:any) =>
            polygon.map((point:any) => ({
              lat: parseFloat(point.lat.toFixed(15)),
              lng: parseFloat(point.lng.toFixed(15)),
            }))
          );
          roundedCoords = roundedCoords.flat();
          const shape = await prisma.shape.create({
            data: {
              type: "POLYGON",
              userId: userId,
              polygon: {
                create: {
                  coords: roundedCoords, 
                },
              },
            },
            include: {
              polygon: true,
            },
          });
      
          return NextResponse.json(shape, { status: 201 }); 
    }
    async getPolygon(userId: number): Promise<Response> {
      const admins = await prisma.user.findMany({ where: { role: "admin" } });
      const adminIds = admins.map((admin) => admin.id);
  
    
      const polygons = await prisma.polygon.findMany({
        where: {
          shape: {
            userId: { in: [...adminIds, userId] },
          },
        },
        include: { shape: true },
      });
      return NextResponse.json(polygons, { status: 200 });
    }
    async deletePolygon(userId: number, coords:LatLng[]): Promise<Response> {
      const areCoordinatesEqual = (coords1: any[], coords2: any[]) => {
        if (coords1.length !== coords2.length) return false;
      
        for (let i = 0; i < coords1.length; i++) {
          const point1 = coords1[i];
          const point2 = coords2[i];
      
          if (
            roundTo10DecimalPlaces(point1.lat) !==
              roundTo10DecimalPlaces(point2.lat) ||
            roundTo10DecimalPlaces(point1.lng) !== roundTo10DecimalPlaces(point2.lng)
          ) {
            return false;
          }
        }
      
        return true;
      };
      const roundTo10DecimalPlaces = (num: number) => {
        return parseFloat(num.toFixed(10));
      };
      const normalizedCoords = Array.isArray(coords) ? coords : [coords];

    
      const roundedCoords = normalizedCoords.map((point: any) => ({
        lat: roundTo10DecimalPlaces(point.lat),
        lng: roundTo10DecimalPlaces(point.lng),
      }));

      const polygons = await prisma.polygon.findMany({
        where: {
          shape: {
            userId: userId,
          },
        },
      });
  
      // Find the polygon with matching coordinates (up to 10 decimal places)
      const polygon = polygons.find((polygon) => {
        // Ensure polygon.coords is a flat array of objects
        let dbCoords = polygon.coords;
  
        // If polygon.coords is a nested array, flatten it
        if (
          Array.isArray(dbCoords) &&
          dbCoords.length > 0 &&
          Array.isArray(dbCoords[0])
        ) {
          dbCoords = dbCoords.flat();
        }
  
        // Round the database coordinates
        //@ts-expect-error
        const roundedDbCoords = dbCoords?.map((point: any) => ({
          lat: roundTo10DecimalPlaces(point.lat),
          lng: roundTo10DecimalPlaces(point.lng),
        }));
  
        // Compare the coordinates
        return areCoordinatesEqual(roundedDbCoords, roundedCoords);
      });
  
      if (!polygon) {
        return NextResponse.json({ error: "Polygon not found" });
      }
  
      // Delete the polygon
      await prisma.polygon.delete({
        where: {
          id: polygon.id,
        },
      });
  
      return new NextResponse(null,{status:204})
    }

}
