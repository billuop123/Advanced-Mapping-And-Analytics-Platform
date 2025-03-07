"use client";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Coordinates {
  lat: number;
  lng: number;
}

interface Bounds {
  northeast: Coordinates;
  southwest: Coordinates;
}

interface User {
  id: number;
  name: string;
  email: string;
  image: string;
  password: null;
  role: string;
}

interface Rectangle {
  id: number;
  shapeId: number;
  bounds: Bounds;
}

interface Polygon {
  id: number;
  shapeId: number;
  coords: Coordinates[];
}

interface Circle {
  id: number;
  shapeId: number;
  center: Coordinates;
  radius: number;
}

interface Polyline {
  id: number;
  shapeId: number;
  coords: Coordinates[];
}

interface ShapeInfo {
  id: number;
  type: "RECTANGLE" | "CIRCLE" | "POLYGON" | "POLYLINE";
  user: User;
  rectangle: Rectangle | null;
  polygon: Polygon | null;
  circle: Circle | null;
  polyline: Polyline | null;
  date: string;
}

interface ApiResponse {
  polygonInfo: ShapeInfo[];
}

const GeometryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3001/api/v1/user/editing/${id}`
        );
        setData(response.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching data"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleDelete = async (shapeId: number | undefined) => {
    if (!shapeId) return;
    try {
      await axios.delete(
        `http://localhost:3001/api/v1/shapes/deleteshapebyid/${shapeId}`
      );
      setData((prevData) => ({
        polygonInfo:
          prevData?.polygonInfo.filter((shape) => shape.id !== shapeId) || [],
      }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while deleting the shape"
      );
    }
  };

  // Initialize shape counts with 0 for each type
  const shapeCounts = {
    RECTANGLE: 0,
    CIRCLE: 0,
    POLYGON: 0,
    POLYLINE: 0,
  };

  // Update shape counts based on data
  if (data) {
    data.polygonInfo.forEach((shape) => {
      if (shape.polygon || shape.rectangle || shape.circle || shape.polyline) {
        shapeCounts[shape.type] += 1;
      }
    });
  }

  const rectangles = data?.polygonInfo.filter(
    (shape) => shape.type === "RECTANGLE" && shape.rectangle
  );
  const circles = data?.polygonInfo.filter(
    (shape) => shape.type === "CIRCLE" && shape.circle
  );
  const polygons = data?.polygonInfo.filter(
    (shape) => shape.type === "POLYGON" && shape.polygon
  );
  const lines = data?.polygonInfo.filter(
    (shape) => shape.type === "POLYLINE" && shape.polyline
  );

  const hasShapes =
    (rectangles && rectangles.length > 0) ||
    (circles && circles.length > 0) ||
    (polygons && polygons.length > 0) ||
    (lines && lines.length > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">No data available</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Geometry Information Display</h1>

      {/* User Information */}
      <section className="mb-8 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <div className="flex items-center gap-4">
          <Image
            width={12}
            height={12}
            src={data.polygonInfo[0].user.image}
            alt={data.polygonInfo[0].user.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="font-medium">{data.polygonInfo[0].user.name}</p>
            <p className="text-gray-600">{data.polygonInfo[0].user.email}</p>
            <p className="text-gray-600">
              Role: {data.polygonInfo[0].user.role}
            </p>
          </div>
        </div>
      </section>

      {/* Shape Statistics */}
      <section className="mb-8 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Shape Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(shapeCounts).map(([type, count]) => (
            <div key={type} className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium">{type}</h3>
              <p className="text-2xl font-bold">{count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Shape Information (only shown if there are shapes) */}
      {hasShapes && (
        <section className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Detailed Shape Information
          </h2>

          {rectangles && rectangles.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Rectangles</h3>
              {rectangles.map((shape, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded">
                  <p className="font-medium">
                    Rectangle ID: {shape.rectangle?.id}
                  </p>
                  <p className="font-medium">
                    Shape ID: {shape.rectangle?.shapeId}
                  </p>
                  <p className="font-medium">
                    Date: {new Date(shape.date).toLocaleString()}
                  </p>
                  <div className="mt-2">
                    <p className="font-medium">Bounds:</p>
                    <p className="text-sm">
                      Northeast: ({shape.rectangle?.bounds.northeast.lat},{" "}
                      {shape.rectangle?.bounds.northeast.lng})
                    </p>
                    <p className="text-sm">
                      Southwest: ({shape.rectangle?.bounds.southwest.lat},{" "}
                      {shape.rectangle?.bounds.southwest.lng})
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(shape.rectangle?.shapeId)}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          {circles && circles.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Circles</h3>
              {circles.map((shape, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded">
                  <p className="font-medium">Circle ID: {shape.circle?.id}</p>
                  <p className="font-medium">
                    Shape ID: {shape.circle?.shapeId}
                  </p>
                  <p className="font-medium">
                    Date: {new Date(shape.date).toLocaleString()}
                  </p>
                  <div className="mt-2">
                    <p className="font-medium">Center:</p>
                    <p className="text-sm">
                      Center: ({shape.circle?.center.lat},{" "}
                      {shape.circle?.center.lng})
                    </p>
                    <p className="font-medium">Radius:</p>
                    <p className="text-sm">{shape.circle?.radius}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(shape.circle?.shapeId)}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          {polygons && polygons.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Polygons</h3>
              {polygons.map((shape, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded">
                  <p className="font-medium">Polygon ID: {shape.polygon?.id}</p>
                  <p className="font-medium">
                    Shape ID: {shape.polygon?.shapeId}
                  </p>
                  <p className="font-medium">
                    Date: {new Date(shape.date).toLocaleString()}
                  </p>
                  <div className="mt-2">
                    <p className="font-medium">Coordinates:</p>
                    {shape.polygon?.coords.map((coord, idx) => (
                      <p key={idx} className="text-sm">
                        Point {idx + 1}: ({coord.lat}, {coord.lng})
                      </p>
                    ))}
                  </div>
                  <button
                    onClick={() => handleDelete(shape.polygon?.shapeId)}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          {lines && lines.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Lines</h3>
              {lines.map((shape, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded">
                  <p className="font-medium">Line ID: {shape.polyline?.id}</p>
                  <p className="font-medium">
                    Shape ID: {shape.polyline?.shapeId}
                  </p>
                  <p className="font-medium">
                    Date: {new Date(shape.date).toLocaleString()}
                  </p>
                  <div className="mt-2">
                    <p className="font-medium">Coordinates:</p>
                    {shape.polyline?.coords.map((coord, idx) => (
                      <p key={idx} className="text-sm">
                        Point {idx + 1}: ({coord.lat}, {coord.lng})
                      </p>
                    ))}
                  </div>
                  <button
                    onClick={() => handleDelete(shape.polyline?.shapeId)}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default GeometryPage;
