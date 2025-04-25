import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectFilterProps {
  selectedShapeType: string;
  setSelectedShapeType: (value: string) => void;
}

export default function SelectFilter({ selectedShapeType, setSelectedShapeType }: SelectFilterProps) {
  return (
    <Select
      value={selectedShapeType}
      onValueChange={setSelectedShapeType}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select shape type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">All Shapes</SelectItem>
        <SelectItem value="RECTANGLE">Rectangles</SelectItem>
        <SelectItem value="CIRCLE">Circles</SelectItem>
        <SelectItem value="POLYGON">Polygons</SelectItem>
        <SelectItem value="POLYLINE">Lines</SelectItem>
      </SelectContent>
    </Select>
  );
}