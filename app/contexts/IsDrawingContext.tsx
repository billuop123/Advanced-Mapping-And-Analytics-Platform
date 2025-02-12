import React, { createContext, ReactNode, useContext, useRef } from "react";

// Define the context type correctly
type DrawingContextType = {
  isDrawing: React.RefObject<boolean>;
};

// Create the context
const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

// Create a provider component
export const DrawingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const isDrawing = useRef(false); // useRef to persist state without re-renders

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
