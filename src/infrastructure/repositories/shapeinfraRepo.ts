import { prisma } from "@/app/services/prismaClient";
import { ShapeRepository } from "@/src/domain/repositories/shapeDomainRepo";
import { NextResponse } from "next/server";

export class ShapeRepositoryImpl implements ShapeRepository {
    async batchCreateShapes(userId: number, shapes: any): Promise<Response> {
        const shapeData = shapes.map((shape:any) => {
            const { type, data } = shape;
      
            if (!type || !data) {
              throw new Error("Each shape must have a type and data");
            }
      
            const shapeEntry: any = {
              type,
              userId: userId,
            };
            if (type === "CIRCLE") {
              shapeEntry.circle = {
                create: { center: data.center, radius: data.radius },
              };
            } else if (type === "POLYGON") {
              shapeEntry.polygon = { create: { coords: data.coords } };
            } else if (type === "POLYLINE") {
              shapeEntry.polyline = { create: { coords: data.coords } };
            } else if (type === "RECTANGLE") {
              shapeEntry.rectangle = { create: { bounds: data.bounds } };
            } else {
              throw new Error(`Invalid shape type: ${type}`);
            }
      
            return shapeEntry;
          });
      
       
          const createdShapes = await prisma.$transaction(
            shapeData.map((shape:any) =>
              prisma.shape.create({
                data: shape,
                include: {
                  circle: true,
                  polygon: true,
                  polyline: true,
                  rectangle: true,
                },
              })
            )
          );
      
          return NextResponse.json(createdShapes, { status: 201 });
    }
    async deleteAllShapes(userId: number): Promise<Response> {
        await prisma.shape.deleteMany({
            where: { userId: userId },
          });
      
          return NextResponse.json(
            { message: "All shapes deleted successfully" },
            { status: 200 }
          );
    }
    async deleteShapeById(shapeId: number): Promise<Response> {
        
        await prisma.shape.delete({
            where: {
              id: shapeId,
            },
          });
      
          return NextResponse.json(
            { message: "Shape successfully deleted" },
            { status: 200 }
          );
    }
    async getShapeById(shapeId: number): Promise<Response> {
      const shape = await prisma.shape.findUnique({
        where: {
          id: (shapeId)
        },
        include: {
          rectangle: true,
          polygon: true,
          circle: true,
          polyline: true,
          user: true
        }
      });
  
      if (!shape) {
        return NextResponse.json({ error: "Shape not found" }, { status: 404 });
      }
  
      return NextResponse.json(shape, { status: 200 });
    }
    async fetchShapes(userId: number): Promise<Response> {
        throw new Error("Method not implemented.");
    }
}