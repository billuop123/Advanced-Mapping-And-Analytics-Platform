import { LatLng } from "leaflet";

export interface PolygonRepository {
  createPolygon: (userId:number, coords:LatLng[], type: string) => Promise<Response>;
  getPolygon: (userId: number) => Promise<Response>;
  deletePolygon: (userId: number, coords:LatLng[]) => Promise<Response>;
}
