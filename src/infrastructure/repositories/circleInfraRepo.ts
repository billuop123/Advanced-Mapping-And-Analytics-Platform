import { prisma } from "@/app/services/prismaClient";
import { CircleRepository } from "@/src/domain/repositories/circleDomainRepo";
import axios from "axios";
import { LatLng } from "leaflet";
import { NextResponse } from "next/server";

export class CircleRepositoryImpl implements CircleRepository {
  async createCircle(userId: number, center: { center: LatLng; radius: number }, radius: number, type: string): Promise<Response> {
    const roundedCenter = {
      lat: parseFloat(center.center.lat.toFixed(15)),
      lng: parseFloat(center.center.lng.toFixed(15)),
    };
    const roundedRadius = parseFloat(radius.toFixed(15));
    const shape = await prisma.shape.create({
      data: {
        type: "CIRCLE",
        userId: Number(userId), 
        circle: {
          create: {
            center: roundedCenter,
            radius: roundedRadius,
          },
        },
      },
      include: {
        circle: true,
      },
    });
    
    return NextResponse.json(shape, { status: 200 });
  }
  async getCircle(userId: number): Promise<Response> {
    const admins = await prisma.user.findMany({ where: { role: "admin" } });
    const adminIds = admins.map((admin) => admin.id);
    const adminCircles = await prisma.circle.findMany({
      where: {
        shape: {
          userId: { in: adminIds },
        },
      },
      include: { shape: true },
    });
    const userCircles = await prisma.circle.findMany({
      where: {
        shape: {
          userId: userId,
        },
      },
      include: { shape: true },
    });


    const allCircles = [...userCircles, ...adminCircles];
    const uniqueCircles = Array.from(
      new Map(allCircles.map((c) => [c.id, c])).values()
    );

  
    const formattedCircles = uniqueCircles.map((circle) => ({
      center: circle.center,
      radius: circle.radius,
    }));

    return NextResponse.json(formattedCircles, { status: 200 });
  }

  async deleteSingleCircle(userId: number, radius: number, center: LatLng): Promise<Response> {
    const circle = await prisma.circle.findFirst({
      where: {
        radius: radius,
        center: {
          path: ["lat"],
          equals: center.lat,
        },
        shape: {
          userId: Number(userId),
        },
      },
    });

    if (!circle) {
      return NextResponse.json({ error: "Circle not found" }, { status: 404 });
    }

    await prisma.circle.delete({
      where: {
        id: circle.id,
      },
    });

    return NextResponse.json(
      { message: "Circle deleted successfully" },
      { status: 200 }
    );
  }
}       