import React, { Suspense } from "react";
import Topbar from "@/app/workflow/_components/topbar/Topbar";
import { GetWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import { InboxIcon, Loader2Icon } from "lucide-react";
import { waitFor } from "@/lib/helper/waitFor";
import ExecutionTable from "@/app/workflow/runs/[workflowId]/_components/ExecutionTable";

function ExecutionPage({ params }: { params: { workflowId: string } }) {
  return (
    <div className="h-full w-full overflow-auto">
      <Topbar
        title="All runs"
        workflowId={params.workflowId}
        subtitle="list of all your workflow runs"
        hideButtons={true}
      />
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <Loader2Icon size="30" className="animate-spin stroke-primary" />
          </div>
        }>
        <ExecutionTableWrapper workflowId={params.workflowId} />
      </Suspense>
    </div>
  );
}

export default ExecutionPage;

async function ExecutionTableWrapper({ workflowId }: { workflowId: string }) {
  const executions = await GetWorkflowExecutions(workflowId);
  if (!executions) {
    return <div>No executions found</div>;
  }
  if (executions.length === 0) {
    return (
      <div className="container w-full py-6">
        <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <InboxIcon size="40" className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">No runs found for this workflow</p>
            <p className="text-sm text-muted-foreground">
              You can trigger new run in the editor page
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <ExecutionTable workflowId={workflowId} initialData={executions} />;
}
