"use client";

import { Button } from "@/components/ui/button";

interface ViewToggleButtonProps {
  isFrontView: boolean;
  onToggle: () => void;
}

export default function ViewToggleButton({
  isFrontView,
  onToggle,
}: ViewToggleButtonProps) {
  return (
    <div className="absolute top-4 right-4">
      <Button onClick={onToggle} variant="default" size="sm">
        {isFrontView ? "View Back" : "View Front"}
      </Button>
    </div>
  );
}

