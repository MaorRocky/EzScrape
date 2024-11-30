"use client";

import { Button } from "@/components/ui/button";
import { PlayIcon, UploadIcon } from "lucide-react";
import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { useMutation } from "@tanstack/react-query";
import { RunWorkFlow } from "@/actions/workflows/runWorkflow";
import { toast } from "sonner";
import { useReactFlow } from "@xyflow/react";
import { PublishWorkflow } from "@/actions/workflows/PublishWorkflow";

function PublishButton({ workflowId }: { workflowId: string }) {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();
  const mutation = useMutation({
    mutationFn: PublishWorkflow,
    onSuccess: () => {
      toast.success("Workflow published", { id: workflowId });
    },
    onError: (error) => {
      toast.error(error.message, { id: workflowId });
    },
  });

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 font-bold border-2 border-sky-400"
      disabled={mutation.isPending}
      onClick={() => {
        const plan = generate();
        if (!plan) {
          //client side validation
          return;
        }
        toast.loading("Publishing workflow...", { id: workflowId });
        mutation.mutate({ id: workflowId, flowDefinition: JSON.stringify(toObject()) });
      }}>
      <UploadIcon size="16" className="stroke-sky-400" />
      Publish
    </Button>
  );
}

export default PublishButton;
