import { LatLng } from "leaflet";

export interface LineRepository {
  createLine: (userId:number, coords:LatLng[]) => Promise<Response>;
  getLine: (userId: number) => Promise<Response>;
  deleteSingleLine: (userId: number,coords:LatLng[]) => Promise<Response>;
}
