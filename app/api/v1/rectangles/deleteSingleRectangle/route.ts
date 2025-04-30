import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken"
import { RectangleRepositoryImpl } from "@/src/infrastructure/repositories/rectangleInfraRepo";
import { DeleteRectangleUseCase } from "@/src/application/use-cases/rectangles/DeleteRectangleUseCase";
const roundTo10DecimalPlaces = (num:Number) => {
  return parseFloat(num.toFixed(10));
};

export async function POST(req: Request) {
 
    const { bounds } = await req.json();
    const session = await getServerSession(options);
                                        
                                      
    if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
                          
                                          const {userId} = jwt.decode(session.user.accessToken) as {userId:number}
    // Validate input
    if (!bounds) {
      return NextResponse.json(
        { error: "Email and bounds are required" },
        { status: 400 }
      );
    }

    const roundedBounds = {
      southwest: {
        lat: roundTo10DecimalPlaces(bounds._southWest.lat),
        lng: roundTo10DecimalPlaces(bounds._southWest.lng),
      },
      northeast: {
        lat: roundTo10DecimalPlaces(bounds._northEast.lat),
        lng: roundTo10DecimalPlaces(bounds._northEast.lng),
      },
    };

    console.log("Rounded Bounds:", roundedBounds);



    if (!userId) {
      return NextResponse.json(null, { status: 404 });
    }
    const rectangleRepository = new RectangleRepositoryImpl();
    const deleteRectagleUseCase = new DeleteRectangleUseCase(rectangleRepository);
    const result = await deleteRectagleUseCase.execute(userId,roundedBounds);
    return result;
  } 

