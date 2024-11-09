"use client";

import React from "react";
import { TaskParam } from "@/types/task";
import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { ColorForHandle } from "@/app/workflow/_components/nodes/common";

export function NodeOutputs({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col divide-y gap-1">{children}</div>;
}

export function NodeOutput({ output }: { output: TaskParam }) {
  return (
    <div className="flex justify-end bg-secondary p-3 relative">
      <p className="text-xs text-muted-foreground">{output.name}</p>
      <Handle
        id={output.name}
        type="source"
        position={Position.Right}
        className={cn(
          "!bg-muted-foreground !border-2 !border-background !w-4 !h-4 !-right-2",
          ColorForHandle[output.type]
        )}></Handle>
    </div>
  );
}
