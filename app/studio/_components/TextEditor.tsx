"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FabricText } from "fabric";

interface TextEditorProps {
  onAddText: (text: string, options: TextOptions) => void;
  selectedObject?: FabricText | null;
  onUpdateText: (updates: Partial<TextOptions & { text: string }>) => void;
}

export interface TextOptions {
  fontSize: number;
  fill: string;
  fontFamily: string;

  fontWeight?: "normal" | "bold";
  fontStyle?: "normal" | "italic";
  underline?: boolean;
  textAlign?: "left" | "center" | "right";
  lineHeight?: number;
  charSpacing?: number;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
}

export default function TextEditor({
  onAddText,
  selectedObject,
  onUpdateText,
}: TextEditorProps) {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(22);
  const [textColor, setTextColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Arial");

  const [fontWeight, setFontWeight] = useState<"normal" | "bold">("normal");
  const [fontStyle, setFontStyle] = useState<"normal" | "italic">("normal");
  const [underline, setUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">(
    "center"
  );
  const [lineHeight, setLineHeight] = useState(1.2);
  const [charSpacing, setCharSpacing] = useState(0);
  const [stroke, setStroke] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [opacity, setOpacity] = useState(1);

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

  useEffect(() => {
    if (!selectedObject) return;

    setText(selectedObject.text ?? "");
    setFontSize(selectedObject.fontSize ?? 22);
    setTextColor((selectedObject.fill as string) ?? "#000000");
    setFontFamily(selectedObject.fontFamily ?? "Arial");
  }, [selectedObject]);

  const handleUpdateText = () => {
    if (!selectedObject) return;

    onUpdateText({
      text,
      fontSize,
      fill: textColor,
      fontFamily,
    });
  };

  useEffect(() => {
    if (selectedObject) return;

    // 🔥 Clear editor when nothing selected
    setText("");
    setFontSize(22);
    setTextColor("#000000");
    setFontFamily("Arial");
  }, [selectedObject]);

  const applyLiveUpdate = (
    updates: Partial<TextOptions & { text: string }>
  ) => {
    if (!selectedObject) return;
    onUpdateText(updates);
  };

  return (
    <div className="mt-4 p-4 border rounded-lg bg-white">
      <h3 className="text-sm font-semibold mb-3">
        {selectedObject ? "Edit Text" : "Add Text"}
      </h3>
      <div className="space-y-3">
        <div>
          <Label htmlFor="text-input">Text</Label>
          <Input
            id="text-input"
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              applyLiveUpdate({
                text: e.target.value,
              });
            }}
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
              onChange={(e) => {
                setFontSize(Number(e.target.value));
                applyLiveUpdate({ fontSize: +e.target.value });
              }}
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
                onChange={(e) => {
                  setTextColor(e.target.value);
                  applyLiveUpdate({ fill: e.target.value });
                }}
                className="w-16 h-10 border rounded cursor-pointer"
              />
              <Input
                type="text"
                value={textColor}
                onChange={(e) => {
                  setTextColor(e.target.value);
                  applyLiveUpdate({ fill: e.target.value });
                }}
                placeholder="#000000"
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={fontWeight === "bold" ? "default" : "outline"}
            onClick={() => {
              const v = fontWeight === "bold" ? "normal" : "bold";
              setFontWeight(v);
              applyLiveUpdate({ fontWeight: v });
            }}
          >
            B
          </Button>

          <Button
            variant={fontStyle === "italic" ? "default" : "outline"}
            onClick={() => {
              const v = fontStyle === "italic" ? "normal" : "italic";
              setFontStyle(v);
              applyLiveUpdate({ fontStyle: v });
            }}
          >
            I
          </Button>

          <Button
            variant={underline ? "default" : "outline"}
            onClick={() => {
              setUnderline(!underline);
              applyLiveUpdate({ underline: !underline });
            }}
          >
            U
          </Button>
        </div>

        <select
          value={textAlign}
          onChange={(e) => {
            const v = e.target.value as any;
            setTextAlign(v);
            applyLiveUpdate({ textAlign: v });
          }}
          className="w-full border p-2 rounded"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>

        <Input
  type="number"
  step="0.1"
  value={lineHeight}
  onChange={(e) => {
    const v = +e.target.value;
    setLineHeight(v);
    applyLiveUpdate({ lineHeight: v });
  }}
/>

<Input
  type="number"
  value={charSpacing}
  onChange={(e) => {
    const v = +e.target.value;
    setCharSpacing(v);
    applyLiveUpdate({ charSpacing: v });
  }}
/>


<Input
  type="color"
  value={stroke}
  onChange={(e) => {
    setStroke(e.target.value);
    applyLiveUpdate({ stroke: e.target.value });
  }}
/>

<Input
  type="number"
  min={0}
  value={strokeWidth}
  onChange={(e) => {
    const v = +e.target.value;
    setStrokeWidth(v);
    applyLiveUpdate({ strokeWidth: v });
  }}
/>

<Input
  type="range"
  min={0}
  max={1}
  step={0.05}
  value={opacity}
  onChange={(e) => {
    const v = +e.target.value;
    setOpacity(v);
    applyLiveUpdate({ opacity: v });
  }}
/>




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
            onChange={(e) => {
              setFontFamily(e.target.value);
              applyLiveUpdate({ fontFamily: e.target.value });
            }}
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
          <Button
            onClick={handleUpdateText}
            disabled={!selectedObject}
            variant="secondary"
            className="flex-1"
          >
            Update Text
          </Button>
        </div>
      </div>
    </div>
  );
}
