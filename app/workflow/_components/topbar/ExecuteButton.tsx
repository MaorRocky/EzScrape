"use client";

import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { useMutation } from "@tanstack/react-query";
import { RunWorkFlow } from "@/actions/workflows/runWorkflow";
import { toast } from "sonner";
import { useReactFlow } from "@xyflow/react";

function ExecuteButton({ workflowId }: { workflowId: string }) {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();
  const mutation = useMutation({
    mutationFn: RunWorkFlow,
    onSuccess: () => {
      toast.success("Workflow execution started", { id: "flow-execution" });
    },
    onError: (error) => {
      toast.error(error.message, { id: "flow-execution" });
    },
  });

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 font-bold border-2 border-amber-500"
      disabled={mutation.isPending}
      onClick={() => {
        const plan = generate();
        if (!plan) {
          //client side validation
          return;
        }
        mutation.mutate({ workflowId, flowDefinition: JSON.stringify(toObject()) });
      }}>
      <PlayIcon size="16" className="stroke-orange-400" />
      Execute
    </Button>
  );
}

export default ExecuteButton;
