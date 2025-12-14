"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TextEditorProps {
  onAddText: (text: string, options: TextOptions) => void;
}

export interface TextOptions {
  fontSize: number;
  fill: string;
  fontFamily: string;
}

export default function TextEditor({ onAddText }: TextEditorProps) {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(22);
  const [textColor, setTextColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Arial");

  const handleAddText = () => {
    if (text.trim()) {
      onAddText(text, { fontSize, fill: textColor, fontFamily });
      setText("");
      setFontSize(22);
      setTextColor("#000000");
      setFontFamily("Arial");
    }
  };

  const fontFamilies = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Courier New",
    "Verdana",
  ];

  return (
    <div className="mt-4 p-4 border rounded-lg bg-white">
      <h3 className="text-sm font-semibold mb-3">Add Text</h3>

      <div className="space-y-3">
        <div>
          <Label htmlFor="text-input">Text</Label>
          <Input
            id="text-input"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddText();
              }
            }}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="font-size"
              className="block text-sm font-medium mb-1"
            >
              Font Size
            </label>
            <Input
              id="font-size"
              type="number"
              min="10"
              max="200"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label
              htmlFor="text-color"
              className="block text-sm font-medium mb-1"
            >
              Text Color
            </label>
            <div className="flex gap-2">
              <Input
                id="text-color"
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-16 h-10 border rounded cursor-pointer"
              />
              <Input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                placeholder="#000000"
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="font-family"
            className="block text-sm font-medium mb-1"
          >
            Font Family
          </label>
          <select
            id="font-family"
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {fontFamilies.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleAddText} className="flex-1">
            Add Text
          </Button>
        </div>
      </div>
    </div>
  );
}
