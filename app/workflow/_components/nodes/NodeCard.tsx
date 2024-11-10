"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";
import { AppNodeMissingInputs } from "@/types/appNode";
import useFlowValidation from "@/hooks/useFlowValidation";

function NodeCard({
  children,
  nodeId,
  isSelected,
}: {
  children: React.ReactNode;
  nodeId: string;
  isSelected: boolean;
}) {
  const { getNode, setCenter } = useReactFlow();
  const { invalidInputs } = useFlowValidation();

  const hasInvalidInputs = invalidInputs.some((node) => node.nodeId === nodeId);

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={cn(
        "rounded-md cursor-pointer bg-background border-2 border-separate w-[420px] text-xs gap-1 flex flex-col",
        isSelected && "border-primary",
        hasInvalidInputs && "border-destructive border-2"
      )}>
      {children}
    </div>
  );

  function handleDoubleClick() {
    const node = getNode(nodeId);
    if (!node) {
      return;
    }

    const { position, measured } = node;
    if (!position || !measured) {
      return;
    }

    const { width, height } = measured;
    const x = position.x + width! / 2;
    const y = position.y + height! / 2;

    if (x === undefined || y === undefined) {
      return;
    }

    setCenter(x, y, { zoom: 1.5, duration: 500 });
  }
}

export default NodeCard;
