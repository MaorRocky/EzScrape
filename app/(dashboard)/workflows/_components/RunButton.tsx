"use client";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { RunWorkFlow } from "@/actions/workflows/runWorkflow";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";

function RunButton({ workflowId }: { workflowId: string }) {
  const mutation = useMutation({
    mutationFn: RunWorkFlow,
    onSuccess: () => {
      toast.success("Workflow execution started", { id: workflowId });
    },
    onError: (error) => {
      toast.error(error.message, { id: workflowId });
    },
  });
  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2 border-green-400 border-2"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading("Running workflow...", { id: workflowId });
        mutation.mutate({ workflowId });
      }}>
      <PlayIcon size="16" className="stroke-green-500" />
      Run
    </Button>
  );
}

export default RunButton;
