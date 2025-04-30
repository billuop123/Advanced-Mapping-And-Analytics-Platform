import { prisma } from "@/app/services/prismaClient";
import { RectangleRepository } from "@/src/domain/repositories/rectangleDomainRepo";
import { LatLngBounds } from "leaflet";
import { NextResponse } from "next/server";

export class RectangleRepositoryImpl implements RectangleRepository {
    async createRectangle(userId: number, bounds: { southwest: { lat: number; lng: number }; northeast: { lat: number; lng: number } }): Promise<Response> {
        const roundedBounds = {
            southwest: {
              lat: parseFloat(bounds.southwest.lat.toFixed(15)),
              lng: parseFloat(bounds.southwest.lng.toFixed(15)),
            },
            northeast: {
              lat: parseFloat(bounds.northeast.lat.toFixed(15)),
              lng: parseFloat(bounds.northeast.lng.toFixed(15)),
            },
          };
      
      
      
          if (!userId) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
          }
      
          const shape = await prisma.shape.create({
            data: {
              type: "RECTANGLE",
              userId: userId,
              rectangle: {
                create: {
                  bounds: roundedBounds,
                },
              },
            },
            include: {
              rectangle: true,
            },
          });
      
          return NextResponse.json(shape, { status: 201 });
    }
    async getRectangle(userId: number): Promise<Response> {
      const admins = await prisma.user.findMany({ where: { role: "admin" } });
      const adminIds = admins.map((admin) => admin.id);
  
      const rectangles = await prisma.rectangle.findMany({
        where: {
          shape: {
            userId: { in: [...adminIds, userId] },
          },
        },
        include: { shape: true },
      });
  
      return NextResponse.json(rectangles, { status: 200 });
    }
    async deleteRectangle(userId: number, bounds: { southwest: { lat: number; lng: number }; northeast: { lat: number; lng: number } }): Promise<Response> {
      const roundTo10DecimalPlaces = (num:Number) => {
        return parseFloat(num.toFixed(10));
      };
      const roundedBounds = {
        southwest: {
          lat: roundTo10DecimalPlaces(bounds.southwest.lat),
          lng: roundTo10DecimalPlaces(bounds.southwest.lng),
        },
        northeast: {
          lat: roundTo10DecimalPlaces(bounds.northeast.lat),
          lng: roundTo10DecimalPlaces(bounds.northeast.lng),
        },
      };
      const rectangles = await prisma.rectangle.findMany({
        where: {
          shape: {
            userId: userId, 
          },
        },
      });
  
 
      const rectangle = rectangles.find((rect) => {
        const dbBounds = {
          southwest: {
            //@ts-expect-error
            lat: roundTo10DecimalPlaces(rect.bounds!.southwest.lat),
               //@ts-expect-error
            lng: roundTo10DecimalPlaces(rect.bounds.southwest.lng),
          },
          northeast: {
               //@ts-expect-error
            lat: roundTo10DecimalPlaces(rect.bounds.northeast.lat),
               //@ts-expect-error
            lng: roundTo10DecimalPlaces(rect.bounds.northeast.lng),
          },
        };
        return JSON.stringify(dbBounds) === JSON.stringify(roundedBounds);
      });
  
      if (!rectangle) {
        return NextResponse.json({
          error: "Rectangle with the specified bounds not found",
        });
      }
  
  
      await prisma.rectangle.delete({
        where: {
          id: rectangle.id, 
        },
      });
  
      return new NextResponse(null, { status: 204 });
    }
}
