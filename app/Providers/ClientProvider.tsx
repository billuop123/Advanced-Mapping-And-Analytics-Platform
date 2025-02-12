"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { ShapeProvider } from "../contexts/shapeContext";
import { UserProvider } from "../contexts/LoginContext";
import { PositionProvider } from "../contexts/PositionContext";
import { DrawingProvider } from "../contexts/IsDrawingContext";
import { LocationProvider } from "../contexts/LocationContext";

type ClientProvidersProps = {
  children: ReactNode;
};

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <SessionProvider>
      <ShapeProvider>
        <PositionProvider>
          <DrawingProvider>
            <UserProvider>
              <LocationProvider>{children} </LocationProvider>
            </UserProvider>
          </DrawingProvider>
        </PositionProvider>
      </ShapeProvider>
    </SessionProvider>
  );
}
