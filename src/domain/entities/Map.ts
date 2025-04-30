import { LatLng, LatLngBounds } from "leaflet";

export interface Map {
  id: string;
  zoom: number;
  tileLayerUrl: string;
}
export interface Coordinate {
  lat: number;
  lng: number;
}
export interface ShapesState {
    circles: { center: LatLng; radius: number }[];
    polygons: LatLng[][];
    polylines: LatLng[][];
    rectangles: LatLngBounds[]; 
  }

export interface Location {
    latitude: number;
    longitude: number;
    description: string;
    type: string;
  }

export interface LocationContextType {
    allLocationArray: Location[];
    addLocation: (location: Location) => void;
    fetchMarkers: (email: string) => Promise<void>; 
    loading: boolean; 
    error: string | null; 
    setAllLocationArray: React.Dispatch<React.SetStateAction<Location[]>>;
  }
export interface UserContextType {
    email: string | null;
    photoUrl: string | null;
    name: string | null;
    status: string;
  }

export type PositionContextType = {
    position: [number, number];
    setPosition: (pos: [number, number]) => void;
  };
export interface RoleContextType {
    role: string;
    fetchRole: () => Promise<void>; 
  }