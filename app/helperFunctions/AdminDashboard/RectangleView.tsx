import { ShapeInfo } from "../interfacesAdminDashboard";

export default function RectangleView({rectangles, handleViewShape, openDeleteConfirm}: {rectangles: ShapeInfo[] | undefined, handleViewShape: (shapeId: number) => void, openDeleteConfirm: (shapeId: number) => void}) {
    return       <> {rectangles?.map((shape) => (
        <tr key={shape.rectangle?.id}>
          <td className="px-6 py-4 whitespace-nowrap">Rectangle</td>
          <td className="px-6 py-4 whitespace-nowrap">{shape.rectangle?.id}</td>
          <td className="px-6 py-4 whitespace-nowrap">{new Date(shape.date).toLocaleString()}</td>
          <td className="px-6 py-4">
            <div className="text-sm text-gray-500">
              <p>NE: ({shape.rectangle?.bounds.northeast.lat}, {shape.rectangle?.bounds.northeast.lng})</p>
              <p>SW: ({shape.rectangle?.bounds.southwest.lat}, {shape.rectangle?.bounds.southwest.lng})</p>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex gap-2">
              <button
                onClick={() => handleViewShape(shape.rectangle?.shapeId!)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                View
              </button>
              <button
                onClick={() => openDeleteConfirm(shape.rectangle?.shapeId!)}
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