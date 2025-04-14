
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export async function middleware(request: NextRequest) {

  if(request.cookies.getAll()[request.cookies.getAll().length-1].value){
      return NextResponse.next();
  }
}

// Apply middleware to specific routes
export const config = {
  matcher: ["/api/v1/:path*"],
};