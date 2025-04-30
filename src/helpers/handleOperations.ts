import { NextResponse } from "next/server";
export async function handleGetShapeByIdOperation(response: Response) {
    const data = await response.json();
    switch (Number(response.status)) {
        case 200:
            return NextResponse.json(data, {status: 200})
        case 404:
            return NextResponse.json({error: "Shape not found"}, {status: 404})
        case 500:
            return NextResponse.json({error: "Server Error"}, {status: 500})
        default:
            return NextResponse.json(data, {status: 200})
    }   
}

export async function handleOperation(response: Response, type: string) {
    switch (Number(response.status)) {
        case 200:
            return NextResponse.json({message: `${type} created successfully`}, {status: 200})
        case 201:
            return NextResponse.json({message: `${type} created successfully`}, {status: 200})
        case 400:
            return NextResponse.json({error: `Failed to create ${type}`}, {status: 400})
        case 404:
            return NextResponse.json({error: `Failed to create ${type}`}, {status: 404})
        case 500:
            return NextResponse.json({error: "Server Error"}, {status: 500})
        case 204:
            return new NextResponse(null, {status: 204})
        default:
            return NextResponse.json({message: `${type} created successfully`}, {status: 200})
    }
}

export async function handleBatchCreateShapeOperation(response: Response) {
    switch (Number(response.status)) {
        case 200:
            return NextResponse.json({message: "Shapes created successfully"}, {status: 200})
        case 201:
            return NextResponse.json({message: "Shapes created successfully"}, {status: 200})
        case 400:
            return NextResponse.json({error: "Failed to create shapes"}, {status: 400})
        case 404:
            return NextResponse.json({error: "Failed to create shapes"}, {status: 404})
        case 500:
            return NextResponse.json({error: "Server Error"}, {status: 500})
        default:
            return NextResponse.json({message: "Shapes created successfully"}, {status: 200})
    }
}
export async function handleDeleteAllShapeOperation(response: Response) {
    switch (Number(response.status)) {
        case 200:
            return NextResponse.json({message: "Shapes deleted successfully"}, {status: 200})
        case 404:
            return NextResponse.json({error: "Shapes not found"}, {status: 404})
        case 500:
            return NextResponse.json({error: "Server Error"}, {status: 500})
        default:
            return NextResponse.json({message: "Shapes deleted successfully"}, {status: 200})
    }
}
    