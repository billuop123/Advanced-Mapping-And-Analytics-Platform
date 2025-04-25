export interface Coordinates {
    lat: number;
    lng: number;
  }
  
  export interface Bounds {
    northeast: Coordinates;
    southwest: Coordinates;
  }
  
  export interface User {
    id: number;
    name: string;
    email: string;
    image: string;
    password: null;
    role: string;
  }
  
  export interface Rectangle {
    id: number;
    shapeId: number;
    bounds: Bounds;
  }
  
  export interface Polygon {
    id: number;
    shapeId: number;
    coords: Coordinates[];
  }
  
  export interface Circle {
    id: number;
    shapeId: number;
    center: Coordinates;
    radius: number;
  }
  
  export interface Polyline {
    id: number;
    shapeId: number;
    coords: Coordinates[];
  }
  
  export interface ShapeInfo {
    id: number;
    type: "RECTANGLE" | "CIRCLE" | "POLYGON" | "POLYLINE";
    user: User;
    rectangle: Rectangle | null;
    polygon: Polygon | null;
    circle: Circle | null;
    polyline: Polyline | null;
    date: string;
  }
  
  export interface ApiResponse {
    polygonInfo: ShapeInfo[];
  }