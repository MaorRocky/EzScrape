import React from "react";
import { ExecutionPhaseStatus } from "@/types/workflow";
import { CircleCheckIcon, CircleDashedIcon, CircleXIcon, Loader2Icon } from "lucide-react";

function PhaseStatusBadge({ status }: { status: ExecutionPhaseStatus }) {
  switch (status) {
    case ExecutionPhaseStatus.CREATED:
      return <div className="rounded-full">{status}</div>;
    case ExecutionPhaseStatus.RUNNING:
      return <Loader2Icon size="20" className=" animate-spin stroke-yellow-400" />;
    case ExecutionPhaseStatus.COMPLETED:
      return <CircleCheckIcon size="20" className="stroke-green-400" />;
    case ExecutionPhaseStatus.FAILED:
      return <CircleXIcon size="20" className="stroke-destructive" />;
    case ExecutionPhaseStatus.PENDING:
      return <CircleDashedIcon size="20" className="stroke-muted-foreground" />;
  }
}

export default PhaseStatusBadge;
