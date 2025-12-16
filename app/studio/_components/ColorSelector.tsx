"use client";

import SectionTitle from "@/components/shared/SectionTitle";
import { productColors } from "./constants";

interface ColorSelectorProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export default function ColorSelector({
  selectedColor,
  onColorChange,
}: ColorSelectorProps) {
  return (
    <div className="mt-4 border rounded-md px-1 pb-3 py-1 flex flex-col gap-2">
      <SectionTitle title="Select Color" />
      <div className="flex flex-wrap gap-2 justify-center ">
        {productColors.map((color) => (
          <button
            key={color.value}
            onClick={() => onColorChange(color.value)}
            className={`w-10 h-10 rounded-full border-2 transition-all ${
              selectedColor === color.value
                ? "border-gray-800 scale-110 ring-2 ring-offset-2 ring-gray-400"
                : "border-gray-300 hover:border-gray-500"
            }`}
            style={{ backgroundColor: color.value }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
}
