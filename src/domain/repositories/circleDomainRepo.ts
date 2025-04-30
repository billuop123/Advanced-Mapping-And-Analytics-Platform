import { LatLng } from "leaflet";

export interface CircleRepository {
  createCircle: (userId:number, center:{center:LatLng,radius:number}, radius: number, type: string) => Promise<Response>;
  getCircle: (userId: number) => Promise<Response>;
  deleteSingleCircle: (userId: number,radius:number,center:LatLng) => Promise<Response>;
}
