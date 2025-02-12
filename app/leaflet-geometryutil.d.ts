// leaflet-geometryutil.d.ts
import "leaflet";

declare module "leaflet" {
  namespace GeometryUtil {
    function geodesicArea(latlngs: LatLngExpression[]): number;
  }
}
