"use client";

import { Button } from "@/components/ui/button";
import { RotateCcw, RotateCcwIcon, RotateCcwKey, RotateCw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      <Tooltip >
        <TooltipTrigger  className="cursor-pointer">
          {isFrontView ? (
            <RotateCcw onClick={onToggle} />
          ) : (
            <RotateCw onClick={onToggle} />
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-base">{isFrontView ?"View Back" : "View Front"}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
