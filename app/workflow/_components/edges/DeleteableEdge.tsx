"use client";

import React from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
  useReactFlow,
} from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

function DeleteableEdge(props: EdgeProps) {
  const [edgePath] = getSmoothStepPath(props);
  const labelX = (props.sourceX + props.targetX) / 2;
  const labelY = (props.sourceY + props.targetY) / 2;
  const { setEdges } = useReactFlow();
  return (
    <>
      <BaseEdge path={edgePath} markerEnd={props.markerEnd} style={props.style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}>
          <Button
            variant="outline"
            size="icon"
            className="text-sx w-5 h-5 border cursor-pointer rounded-full leading-none hover:showdow-lg"
            onClick={() => {
              setEdges((edges) => edges.filter((edge) => edge.id !== props.id));
            }}>
            <X className="stroke-red-500" />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default DeleteableEdge;
