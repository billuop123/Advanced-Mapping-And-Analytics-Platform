import React, { createContext, ReactNode, useContext, useRef } from "react";

type DrawingContextType = {
  isDrawing: React.RefObject<boolean>;
};

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

export const DrawingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const isDrawing = useRef(false);

  return (
    <DrawingContext.Provider value={{ isDrawing }}>
      {children}
    </DrawingContext.Provider>
  );
};

export const useDrawing = () => {
  const context = useContext(DrawingContext);
  if (!context) {
    throw new Error("useDrawing must be used within a DrawingProvider");
  }
  return context;
};
