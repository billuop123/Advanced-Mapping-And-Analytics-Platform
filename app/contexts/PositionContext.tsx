"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { useSearchParams } from "next/navigation";
type PositionContextType = {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
};

const PosContext = createContext<PositionContextType | undefined>(undefined);

type PositionProviderProps = {
  children: ReactNode;
};

function PositionProvider({ children }: PositionProviderProps) {
  const searchParams = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const [position, setPosition] = useState<[number, number]>([
    Number(lat) || 50,
    Number(lng) || 50,
  ]);
  return (
    <PosContext.Provider value={{ position, setPosition }}>
      {children}
    </PosContext.Provider>
  );
}

function usePosition() {
  const context = useContext(PosContext);
  if (context === undefined) throw new Error("Context is undefined(Auth)");
  return context;
}

export { PositionProvider, usePosition };
