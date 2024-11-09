"use client";

import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import { UpdateWorkflow } from "@/actions/workflows/updateWorkflow";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

function SaveButton({ workflowId }: { workflowId: string }) {
  const { toObject } = useReactFlow();

  const saveMutation = useMutation({
    mutationFn: UpdateWorkflow,
    onSuccess: () => {
      toast.success("Workflow saved successfully", { id: "save-workflow" });
    },
    onError: (error) => {
      toast.error("Something went wrong", { id: "save-workflow" });
    },
  });

  return (
    <Button
      disabled={saveMutation.isPending}
      variant="outline"
      className="flex items-center gap-2"
      onClick={() => {
        const workflowDefinition = JSON.stringify(toObject());
        toast.loading("Saving workflow...", { id: "save-workflow" });
        saveMutation.mutate({ id: workflowId, definition: workflowDefinition });
      }}>
      <CheckIcon size="16" className="stroke-green-500" />
      Save
    </Button>
  );
}

export default SaveButton;
