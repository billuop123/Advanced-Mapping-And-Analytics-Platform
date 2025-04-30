
export interface ShapeRepository {
  batchCreateShapes: (userId:number,  shapes: any) => Promise<Response>;
  deleteAllShapes: (userId:number) => Promise<Response>;
  deleteShapeById: (shapeId:number) => Promise<Response>;
  getShapeById: ( shapeId:number) => Promise<Response>;
  fetchShapes: (userId:number) => Promise<Response>;
}
