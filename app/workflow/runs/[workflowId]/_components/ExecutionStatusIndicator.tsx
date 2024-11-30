import React from "react";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { cn } from "@/lib/utils";

const indicatorColors: Record<WorkflowExecutionStatus, string> = {
  [WorkflowExecutionStatus.FAILED]: "bg-red-500",
  [WorkflowExecutionStatus.PENDING]: "bg-yellow-500",
  [WorkflowExecutionStatus.RUNNING]: "bg-blue-500",
  [WorkflowExecutionStatus.COMPLETED]: "bg-green-500",
};

function ExecutionStatusIndicator({ status }: { status: WorkflowExecutionStatus }) {
  return <div className={cn("w-2 h-2 rounded-full ", indicatorColors[status])} />;
}

export default ExecutionStatusIndicator;
