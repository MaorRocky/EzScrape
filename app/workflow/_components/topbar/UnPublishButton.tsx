"use client";

import { Button } from "@/components/ui/button";
import { DownloadIcon, PlayIcon, UploadIcon } from "lucide-react";
import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { useMutation } from "@tanstack/react-query";
import { RunWorkFlow } from "@/actions/workflows/runWorkflow";
import { toast } from "sonner";
import { useReactFlow } from "@xyflow/react";
import { PublishWorkflow } from "@/actions/workflows/PublishWorkflow";
import { UnPublishWorkflow } from "@/actions/workflows/unPublishWorkflow";

function UnPublishButton({ workflowId }: { workflowId: string }) {
  const mutation = useMutation({
    mutationFn: UnPublishWorkflow,
    onSuccess: () => {
      toast.success("Workflow Unpublished", { id: workflowId });
    },
    onError: (error) => {
      toast.error(error.message, { id: workflowId });
    },
  });

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 font-bold border-2 border-orange-400"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading("Unpublishing workflow...", { id: workflowId });
        mutation.mutate(workflowId);
      }}>
      <DownloadIcon size="16" className="stroke-orange-500" />
      UnPublish
    </Button>
  );
}

export default UnPublishButton;
