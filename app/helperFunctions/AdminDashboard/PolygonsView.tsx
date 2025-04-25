import { ShapeInfo } from "../interfacesAdminDashboard";

export default function PolygonsView({polygons, handleViewShape, openDeleteConfirm}: {polygons: ShapeInfo[] | undefined, handleViewShape: (shapeId: number) => void, openDeleteConfirm: (shapeId: number) => void}) {
    return <>
           {polygons?.map((shape) => (
                      <tr key={shape.polygon?.id}>
                        <td className="px-6 py-4 whitespace-nowrap">Polygon</td>
                        <td className="px-6 py-4 whitespace-nowrap">{shape.polygon?.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(shape.date).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">
                            {shape.polygon?.coords.map((coord, idx) => (
                              <p key={idx}>Point {idx + 1}: ({coord.lat}, {coord.lng})</p>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewShape(shape.polygon?.shapeId!)}
                              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                            >
                              View
                            </button>
                            <button
                              onClick={() => openDeleteConfirm(shape.polygon?.shapeId!)}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
    </>
}