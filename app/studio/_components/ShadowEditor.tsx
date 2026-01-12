import { Canvas, Shadow } from "fabric";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Props {
  canvas: Canvas;
}

export function ShadowEditor({ canvas }: Props) {
  const obj = canvas.getActiveObject() as any;
  const shadow = obj?.shadow;

  const updateShadow = (updates: Partial<Shadow>) => {
    if (!obj) return;

    const next = new Shadow({
      color: updates.color ?? shadow?.color ?? "#000000",
      blur: updates.blur ?? shadow?.blur ?? 0,
      offsetX: updates.offsetX ?? shadow?.offsetX ?? 0,
      offsetY: updates.offsetY ?? shadow?.offsetY ?? 0,
    });

    obj.set("shadow", next);
    canvas.requestRenderAll();
  };

  return (
    <div className="space-y-2">
      <Label>Shadow</Label>

      <Input
        type="color"
        value={shadow?.color ?? "#000000"}
        onChange={(e) => updateShadow({ color: e.target.value })}
      />

      <Input
        type="range"
        min={0}
        max={50}
        value={shadow?.blur ?? 0}
        onChange={(e) => updateShadow({ blur: +e.target.value })}
      />

      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="X"
          value={shadow?.offsetX ?? 0}
          onChange={(e) => updateShadow({ offsetX: +e.target.value })}
        />
        <Input
          type="number"
          placeholder="Y"
          value={shadow?.offsetY ?? 0}
          onChange={(e) => updateShadow({ offsetY: +e.target.value })}
        />
      </div>

      <Button
        variant="outline"
        onClick={() => {
          obj.set("shadow", null);
          canvas.requestRenderAll();
        }}
      >
        Remove Shadow
      </Button>
    </div>
  );
}
