export interface RectangleRepository {
  createRectangle: (userId:number, bounds: { southwest: { lat: number; lng: number }; northeast: { lat: number; lng: number } }) => Promise<Response>;
  getRectangle: (userId: number) => Promise<Response>;
  deleteRectangle: (userId: number, bounds: { southwest: { lat: number; lng: number }; northeast: { lat: number; lng: number } }) => Promise<Response>;
}
