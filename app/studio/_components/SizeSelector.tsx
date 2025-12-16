"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import SectionTitle from "@/components/shared/SectionTitle";
import { Button } from "@/components/ui/button";
import { productSizes } from "./constants";

type SizeCount = Record<string, number>;

export default function SizeSelector() {
  const [sizesCount, setSizesCount] = useState<SizeCount>({});

  const increment = (size: string) => {
    setSizesCount((prev) => ({
      ...prev,
      [size]: (prev[size] ?? 0) + 1,
    }));
  };

  const decrement = (size: string) => {
    setSizesCount((prev) => {
      const current = prev[size] ?? 0;
      if (current <= 1) {
        const { [size]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [size]: current - 1 };
    });
  };

  return (
    <div className="space-y-3">
      <SectionTitle title="Select sizes" />

      <div className="flex flex-wrap gap-3">
        {productSizes.map((size) => {
          const count = sizesCount[size.value] ?? 0;
          return (
            <div
              key={size.value}
              className="flex items-center gap-2 border rounded-lg p-2"
            >
              <span className="font-medium">{size.name}</span>
              {count === 0 ? (
                <Button size="sm" onClick={() => increment(size.value)}>
                  Add
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => decrement(size.value)}
                  >
                    <Minus className="w-2 h-2" />
                  </Button>

                  <span className="min-w-3 text-center">{count}</span>

                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => increment(size.value)}
                  >
                    <Plus className="w-2 h-2" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {Object.entries(sizesCount).length ? (
        <pre className="bg-muted p-2 rounded text-sm">
          {JSON.stringify(sizesCount, null, 2)}
        </pre>
      ) : (
        <p className="text-destructive">Please select size</p>
      )}
    </div>
  );
}
