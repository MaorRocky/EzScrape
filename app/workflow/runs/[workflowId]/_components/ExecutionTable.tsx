"use client";

import React from "react";
import { GetWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatesToDurationString } from "@/lib/helper/dates";

type initialDataType = Awaited<ReturnType<typeof GetWorkflowExecutions>>;

function ExecutionTable({
  workflowId,
  initialData,
}: {
  workflowId: string;
  initialData: initialDataType;
}) {
  const query = useQuery({
    queryKey: ["workflow-executions", workflowId],
    queryFn: () => GetWorkflowExecutions(workflowId),
    initialData,
    refetchInterval: 5000,
  });

  return (
    <div className="border rounded-lg shadow-md overflow-auto">
      <Table className="h-full">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Credits Consumed</TableHead>
            <TableHead className="text-right text-xs text-muted-foreground">
              Started At (desc)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="gap-2 h-full overflow-auto">
          {query.data?.map((execution) => {
            const duration = DatesToDurationString(execution.completedAt, execution.startedAt);
            return <TableRow key={execution.id}>// todo from here</TableRow>;
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default ExecutionTable;
