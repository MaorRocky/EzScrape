"use client";
import React, { useState } from "react";
import { Workflow } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { WorkflowExecutionStatus, WorkflowStatus } from "@/types/workflow";
import {
  ChevronRightIcon,
  ClockIcon,
  CoinsIcon,
  CornerDownRightIcon,
  CornerRightDown,
  FileTextIcon,
  MoreVertical,
  MoveRightIcon,
  PlayIcon,
  ShuffleIcon,
  TrashIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TooltipWrapper from "@/components/TooltipWrapper";
import DeleteWorkflowDialog from "@/app/(dashboard)/workflows/_components/DeleteWorkflowDialog";
import RunButton from "@/app/(dashboard)/workflows/_components/RunButton";
import SchedulerDialog from "@/app/(dashboard)/workflows/_components/SchedulerDialog";
import { Badge } from "@/components/ui/badge";
import ExecutionStatusIndicator, {
  ExecutionStatusLabel,
} from "@/app/workflow/runs/[workflowId]/_components/ExecutionStatusIndicator";
import { format, formatDistanceToNow } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import DuplicateWorkflowDialog from "@/app/(dashboard)/workflows/_components/DuplicateWorkflowDialog";

const statusColor = {
  [WorkflowStatus.DRAFT]: "bg-yellow-500 text-yellow-600",
  [WorkflowStatus.PUBLISHED]: "bg-primary",
};

function WorkflowActions({
  workflowName,
  workflowId,
}: {
  workflowName: string;
  workflowId: string;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  return (
    <>
      <DeleteWorkflowDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        workflowName={workflowName}
        workflowId={workflowId}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <TooltipWrapper content="More actions">
              <div className="flex items-center w-full h-full justify-center">
                <MoreVertical size="18" />
              </div>
            </TooltipWrapper>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="text-destructive flex items-center gap-2"
            onSelect={() => setShowDeleteDialog((prev) => !prev)}>
            <TrashIcon size="16" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
        <DropdownMenuSeparator />
      </DropdownMenu>
    </>
  );
}

function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;
  return (
    <Card className="border border-separate shadow-sm rounded-r-lg overflow-hidden hover:shodow-md dark:shadow-primary/30 ">
      <CardContent className="p-4 flex items-center justify-between h-[100px]">
        <div className="flex items-center justify-end space-x-3">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              statusColor[workflow.status as WorkflowStatus]
            )}>
            {isDraft ? (
              <FileTextIcon className="w-5 h-5" />
            ) : (
              <PlayIcon className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-muted-foreground flex items-center">
              <TooltipWrapper content={workflow.description}>
                <Link
                  href={`/workflow/editor/${workflow.id}`}
                  className="flex items-center hover:underline">
                  {workflow.name}
                </Link>
              </TooltipWrapper>
              {isDraft && (
                <span className="ml-2 px-2 text-xs bg-yellow-100 text-center text-yellow-800 rounded-full">
                  Draft
                </span>
              )}
              <DuplicateWorkflowDialog workflowId={workflow.id} />
            </h3>
            <ScheduleSection
              isDraft={isDraft}
              creditsCost={workflow.creditsCost}
              workflowId={workflow.id}
              cron={workflow.cron}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isDraft && <RunButton workflowId={workflow.id} />}
          <Link
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "flex items-center gap-2"
            )}
            href={`/workflow/editor/${workflow.id}`}>
            <ShuffleIcon size="16" />
            Edit
          </Link>
          <WorkflowActions workflowName={workflow.name} workflowId={workflow.id} />
        </div>
      </CardContent>
      <LastRunDetails workflow={workflow} />
    </Card>
  );
}

export default WorkflowCard;

function ScheduleSection({
  isDraft,
  creditsCost,
  workflowId,
  cron,
}: {
  isDraft: boolean;
  creditsCost: number;
  workflowId: string;
  cron: string | null;
}) {
  if (isDraft) {
    return null;
  }
  return (
    <div className="flex items-center gap-2">
      <CornerDownRightIcon className="h-4 w-4 text-muted-foreground" />
      <SchedulerDialog workflowId={workflowId} cronProps={cron} key={`${cron}-${workflowId}`} />
      <MoveRightIcon className="h-4 w-4 text-muted-foreground" />
      <TooltipWrapper content="Credit Consumption for a full run">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="space-x-2 text-muted-foreground rounded-sm ">
            <CoinsIcon className="h-4 w-4" />
            <span className="text-sm">{creditsCost}</span>
          </Badge>
        </div>
      </TooltipWrapper>
    </div>
  );
}

function LastRunDetails({ workflow }: { workflow: Workflow }) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;
  if (isDraft) {
    return null;
  }
  const { lastRunAt, lastRunStatus, lastRunId, nextRunAt } = workflow;
  const formattedStartedAt = lastRunAt && formatDistanceToNow(lastRunAt, { addSuffix: true });
  const nextSchedule = nextRunAt && format(nextRunAt, "yyyy-MM-dd HH:mm");
  const nextScheduleUtc = nextRunAt && formatInTimeZone(nextRunAt, "UTC", "HH:mm");
  return (
    <div className="bg-primary/5 px-4 py-1 flex justify-between items-center text-muted-foreground">
      <div className="flex items-center text-sm gap-2">
        {lastRunAt && (
          <Link
            href={`/workflow/runs/${workflow.id}/${lastRunId}`}
            className="flex items-center text-sm gap-2 group">
            <span>Last Run</span>
            <ExecutionStatusIndicator status={lastRunStatus as WorkflowExecutionStatus} />
            <ExecutionStatusLabel status={lastRunStatus as WorkflowExecutionStatus} />
            <span>{formattedStartedAt}</span>
            <ChevronRightIcon
              size="16"
              className="-translate-x-[4px] group-hover:translate-x-0 transition "
            />
          </Link>
        )}
        {!lastRunAt && <p>No Runs Yet</p>}
      </div>
      {nextRunAt && (
        <div className="flex items-center text-sm gap-2">
          <ClockIcon size="14" />
          <span>Next Run At:</span>
          <span>{nextSchedule}</span>
          <span className="text-xs">({nextScheduleUtc} UTC)</span>
        </div>
      )}
    </div>
  );
}
