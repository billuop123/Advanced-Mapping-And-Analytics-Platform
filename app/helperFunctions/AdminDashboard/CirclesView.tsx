import { ShapeInfo } from "../interfacesAdminDashboard";

export default function CirclesView({circles, handleViewShape, openDeleteConfirm}: {circles: ShapeInfo[] | undefined, handleViewShape: (shapeId: number) => void, openDeleteConfirm: (shapeId: number) => void}) {
    return <>{circles?.map((shape) => (
      <tr key={shape.circle?.id}>
        <td className="px-6 py-4 whitespace-nowrap">Circle</td>
        <td className="px-6 py-4 whitespace-nowrap">{shape.circle?.id}</td>
        <td className="px-6 py-4 whitespace-nowrap">{new Date(shape.date).toLocaleString()}</td>
        <td className="px-6 py-4">
          <div className="text-sm text-gray-500">
            <p>Center: ({shape.circle?.center.lat}, {shape.circle?.center.lng})</p>
            <p>Radius: {shape.circle?.radius}</p>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex gap-2">
            <button
              onClick={() => handleViewShape(shape.circle?.shapeId!)}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              View
            </button>
            <button
              onClick={() => openDeleteConfirm(shape.circle?.shapeId!)}
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