"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, FileIcon, XCircle, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UploadLocationProps {
  onUploadSuccess?: (filename: string) => void;
  onUploadError?: (error: string) => void;
}

export default function UploadLocation({ onUploadSuccess, onUploadError }: UploadLocationProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.type !== "image/svg+xml") {
      setError("Please select an SVG file");
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setError(null);
    setName(selectedFile.name.replace('.svg', ''));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
    setName("");
  };

  const handleUpload = async () => {
    if (!file || !name) return;

    setIsUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);

    try {
      const response = await fetch("/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        onUploadSuccess?.(data.filename);
        setFile(null);
        setName("");
      } else {
        const error = data.error || "Upload failed";
        setError(error);
        onUploadError?.(error);
      }
    } catch (error) {
      const errorMsg = "Failed to upload file";
      setError(errorMsg);
      onUploadError?.(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border border-gray-200 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 border-b border-gray-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <MapPin className="h-8 w-8 text-white" />
          <div>
            <CardTitle className="text-2xl font-bold text-white">Upload Location Icon</CardTitle>
            <CardDescription className="text-blue-100 mt-1">
              Add a custom SVG icon for your map locations
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        <div className="space-y-6">
          <div 
            className={`border-2 border-dashed rounded-lg ${
              isDragging 
                ? "border-blue-500 bg-blue-50" 
                : file 
                  ? "border-green-300 bg-green-50" 
                  : "border-gray-300 bg-gray-50"
            } transition-colors duration-200 ease-in-out`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="p-6 flex flex-col items-center justify-center gap-3">
              {file ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <FileIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button 
                    onClick={clearFile}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                    disabled={isUploading}
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <Upload className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-lg font-medium text-gray-700">Drag and drop your SVG file here</p>
                  <p className="text-sm text-gray-500 text-center">or click to select a file from your device</p>
                </>
              )}
              
              <Input
                id="file"
                type="file"
                accept=".svg"
                onChange={handleFileChange}
                disabled={isUploading}
                className={`${file ? "hidden" : "opacity-0 absolute inset-0 w-full h-full cursor-pointer"}`}
              />
              
              {!file && (
                <Button 
                  variant="outline" 
                  className="mt-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                  onClick={() => document.getElementById("file")?.click()}
                  disabled={isUploading}
                >
                  Select File
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center justify-between">
              <span>Icon Name</span>
              {name && <span className="text-xs text-gray-500">{name.length}/50</span>}
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. restaurant-icon, park-icon"
              disabled={isUploading || !file}
              className="focus-visible:ring-blue-500 shadow-sm"
              maxLength={50}
            />
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-50 border border-red-200 rounded-lg">
              <AlertDescription className="text-sm text-red-700 flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleUpload}
            disabled={!file || !name || isUploading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-sm transition-all duration-200 ease-in-out hover:shadow"
          >
            {isUploading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Uploading...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Upload className="h-5 w-5" />
                <span>Upload Location Icon</span>
              </div>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 