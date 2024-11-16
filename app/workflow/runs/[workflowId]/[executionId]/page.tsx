import React, { Suspense } from "react";
import Topbar from "@/app/workflow/_components/topbar/Topbar";
import { Loader2Icon } from "lucide-react";
import { GetWorkFlowExecutionWithPhases } from "@/actions/workflows/getWorkFlowExecutionWithPhases";
import ExecutionViewer from "@/app/workflow/runs/[workflowId]/[executionId]/_components/ExecutionViewer";

function ExecutionViewerPage({
  params: { workflowId, executionId },
}: {
  params: { workflowId: string; executionId: string };
}) {
  return (
    <div className="flex flex-col w-full overflow-hidden h-screen">
      <Topbar
        workflowId={workflowId}
        title="Workflow run details"
        subtitle={`Run ID ${executionId}`}
        hideButtons
      />
      <section className="flex h-full overflow-auto">
        <Suspense
          fallback={
            <div className="flex w-full items-center justify-center">
              <Loader2Icon className="h-20 w-20 animate-spin stroke-primary" />
            </div>
          }>
          <ExecutionViewerWrapper executionId={executionId} />
        </Suspense>
      </section>
    </div>
  );
}

export default ExecutionViewerPage;

async function ExecutionViewerWrapper({ executionId }: { executionId: string }) {
  const workFlowExecution = await GetWorkFlowExecutionWithPhases(executionId);

  if (!workFlowExecution) {
    return <div>Execution not found</div>;
  }

  return <ExecutionViewer initialData={workFlowExecution} />;
}
