import { NextResponse } from "next/server";

export async  function handlePolygonOperation(response: Response) {
    console.log(response.status)
    switch (Number(response.status)) {
        case 200:
           return NextResponse.json({message: "Polygon created successfully"}, {status: 200})
        case 201:
            return NextResponse.json({message: "Polygon created successfully"}, {status: 200})
        case 400:
          
           return NextResponse.json({error: "Failed to create polygon"}, {status: 400})
        case 404:
            
            return NextResponse.json({error: "Failed to create polygon"}, {status: 404})
        case 500:
            return NextResponse.json({error: "Server Error"}, {status: 500})
        case 204:
            return new NextResponse(null,{status:204})
        default:
            return NextResponse.json({message: "Polygon created successfully"}, {status: 200})
    }
}
export async  function handleRectangleOperation(response: Response) {
 
    switch (Number(response.status)) {
        case 200:
           return NextResponse.json({message: "Rectangle created successfully"}, {status: 200})
        case 201:
            return NextResponse.json({message: "Rectangle created successfully"}, {status: 200})
        case 400:
          
           return NextResponse.json({error: "Failed to create Rectangle"}, {status: 400})
        case 404:
            
            return NextResponse.json({error: "Failed to create Rectangle"}, {status: 404})
        case 500:
            return NextResponse.json({error: "Server Error"}, {status: 500})
        case 204:
            return new NextResponse(null, { status: 204 });
        default:
            return NextResponse.json({message: "Rectangle created successfully"}, {status: 200})
    }
}
export async  function handleLineOperation(response: Response) {
 
    switch (Number(response.status)) {
        case 200:
           return NextResponse.json({message: "Line created successfully"}, {status: 200})
        case 201:
            return NextResponse.json({message: "Line created successfully"}, {status: 200})
        case 400:
          
           return NextResponse.json({error: "Failed to create Line"}, {status: 400})
        case 404:
            
            return NextResponse.json({error: "Failed to create Line"}, {status: 404})
        case 500:
            return NextResponse.json({error: "Server Error"}, {status: 500})
        case 204:
            return new NextResponse(null, { status: 204 });
        default:
            return NextResponse.json({message: "Line created successfully"}, {status: 200})
    }
}