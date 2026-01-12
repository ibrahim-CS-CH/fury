import clsx from "clsx";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
} from "lucide-react";
import { useEffect, useState } from "react";

import { deleteControl } from "@/app/_providers/sesion-helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FabricText } from "fabric";

interface TextEditorProps {
  onAddText: (text: string, options: TextOptions) => void;
  selectedObject?: TextOptions | null;
  onUpdateText: (updates: Partial<TextOptions & { text: string }>) => void;
  canvas: any;
  handleGetObjects: () => void;
}

export interface TextOptions {
  text?: string;
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

type EditorState = TextOptions & { text: string };

const DEFAULT_STATE: EditorState = {
  text: "",
  fontSize: 22,
  fill: "#000000",
  fontFamily: "Arial",
  fontWeight: "normal",
  fontStyle: "normal",
  underline: false,
  textAlign: "center",
  lineHeight: 1.2,
  charSpacing: 0,
  stroke: "#000000",
  strokeWidth: 0,
  opacity: 1,
};

const FONT_FAMILIES = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Courier New",
  "Verdana",
];

export default function TextEditor({
  onAddText,
  selectedObject,
  onUpdateText,
  canvas,
  handleGetObjects,
}: TextEditorProps) {
  const [state, setState] = useState<EditorState>(DEFAULT_STATE);

  useEffect(() => {
    if (!selectedObject) {
      setState(DEFAULT_STATE);
      return;
    }

    // handleGetObjects();

    // selectedObject.controls = {
    //   ...selectedObject.controls,
    //   deleteControl,
    // };

    setState({
      ...DEFAULT_STATE,
      ...selectedObject,
      // deleteControl,
      text: selectedObject.text ?? "",
    });
    console.log("selected object", selectedObject);
  }, [selectedObject]);

  const update = <K extends keyof EditorState>(
    key: K,
    value: EditorState[K]
  ) => {
    setState((prev) => ({ ...prev, [key]: value }));

    if (selectedObject) {
      onUpdateText({ [key]: value });
    }
  };

  const handleAddText = () => {
    if (!state.text.trim()) return;

    const { text, ...options } = state;
    onAddText(text, options);
    setState(DEFAULT_STATE);
  };

  return (
    <div className="p-2 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold">
          {selectedObject ? "Edit Text" : "Add Text"}
        </h3>
        <Button
          onClick={handleAddText}
          className={clsx("border", {
            "cursor-pointer": state.text.trim(),
          })}
          variant={!state.text.trim() ? "secondary" : "default"}
          disabled={!!selectedObject}
        >
          Add Text
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Text</Label>
        <Textarea
          value={state.text}
          onChange={(e) => update("text", e.target.value)}
          placeholder="Enter text..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          {" "}
          <Label>Font Size</Label>
          <Input
            type="number"
            min={10}
            max={200}
            value={state.fontSize}
            onChange={(e) => update("fontSize", +e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Text Color</Label>
          <Input
            type="color"
            value={state.fill}
            onChange={(e) => update("fill", e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant={state.fontWeight === "bold" ? "default" : "outline"}
          onClick={() =>
            update(
              "fontWeight",
              state.fontWeight === "bold" ? "normal" : "bold"
            )
          }
        >
          <Bold />
        </Button>

        <Button
          variant={state.fontStyle === "italic" ? "default" : "outline"}
          onClick={() =>
            update(
              "fontStyle",
              state.fontStyle === "italic" ? "normal" : "italic"
            )
          }
        >
          <Italic />
        </Button>

        <Button
          variant={state.underline ? "default" : "outline"}
          onClick={() => update("underline", !state.underline)}
        >
          <Underline />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Align</Label>
        <div className="flex gap-2">
          {(["left", "center", "right"] as const).map((align) => (
            <Button
              key={align}
              variant={state.textAlign === align ? "default" : "outline"}
              onClick={() => update("textAlign", align)}
            >
              {align === "left" && <AlignLeft />}
              {align === "center" && <AlignCenter />}
              {align === "right" && <AlignRight />}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Line Height</Label>
        <Input
          type="number"
          step={0.1}
          value={state.lineHeight}
          onChange={(e) => update("lineHeight", +e.target.value)}
        />
      </div>

      <div>
        <Label>Spacing</Label>
        <Input
          type="range"
          min={-500}
          max={1000}
          step={30}
          value={state.charSpacing}
          onChange={(e) => update("charSpacing", +e.target.value)}
        />
      </div>

      {/* Stroke */}
      <div className="flex gap-2 justify-between">
        <div className="flex-col gap-1 flex-1 ">
          <Label>Stroke</Label>
          <Input
            type="range"
            min={0}
            max={3}
            step={0.2}
            value={state.strokeWidth}
            onChange={(e) => update("strokeWidth", +e.target.value)}
          />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <Label>Stroke color</Label>
          <Input
            type="color"
            value={state.stroke}
            onChange={(e) => update("stroke", e.target.value)}
          />
        </div>
      </div>

      {/* Opacity */}
      <div>
        <Label>Opacity</Label>
        <Input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={state.opacity}
          onChange={(e) => update("opacity", +e.target.value)}
        />
      </div>
      {/* <ShadowEditor canvas={canvas} /> */}
      {/* Font family */}
      <div className="flex flex-col gap-2">
        <Label>Font Family</Label>
        <Select
          value={state.fontFamily}
          onValueChange={(e) => update("fontFamily", e)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Font family" />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILIES.map((font) => (
              <SelectItem key={font} value={font}>
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Disable hint
      {!selectedObject && (
        <p className="text-xs text-muted-foreground">
          Select a text object to edit
        </p>
      )} */}
    </div>
  );
}
