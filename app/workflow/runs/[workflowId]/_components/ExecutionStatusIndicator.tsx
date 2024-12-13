import React from "react";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { cn } from "@/lib/utils";

const indicatorColors: Record<WorkflowExecutionStatus, string> = {
  [WorkflowExecutionStatus.FAILED]: "bg-red-500",
  [WorkflowExecutionStatus.PENDING]: "bg-yellow-500",
  [WorkflowExecutionStatus.RUNNING]: "bg-blue-500",
  [WorkflowExecutionStatus.COMPLETED]: "bg-green-500",
};

const labelColors: Record<WorkflowExecutionStatus, string> = {
  [WorkflowExecutionStatus.FAILED]: "text-red-500",
  [WorkflowExecutionStatus.PENDING]: "text-yellow-500",
  [WorkflowExecutionStatus.RUNNING]: "text-blue-500",
  [WorkflowExecutionStatus.COMPLETED]: "text-green-500",
};

function ExecutionStatusIndicator({ status }: { status: WorkflowExecutionStatus }) {
  return <div className={cn("w-2 h-2 rounded-full ", indicatorColors[status])} />;
}

export function ExecutionStatusLabel({ status }: { status: WorkflowExecutionStatus }) {
  return <span className={cn("lowercase ", labelColors[status])}>{status}</span>;
}

export default ExecutionStatusIndicator;
