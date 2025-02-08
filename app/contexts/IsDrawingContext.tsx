// contexts/DrawingContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
} from "react";

// Define the context type
type DrawingContextType = {
  isDrawing: boolean;
  setIsDrawing: (isDrawing: boolean) => void;
};

// Create the context
const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

// Create a provider component
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

// Custom hook to use the DrawingContext
export const useDrawing = () => {
  const context = useContext(DrawingContext);
  if (!context) {
    throw new Error("useDrawing must be used within a DrawingProvider");
  }
  return context;
};
