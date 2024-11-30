"use client";

import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";

import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import SaveButton from "@/app/workflow/_components/topbar/SaveButton";
import ExecuteButton from "@/app/workflow/_components/topbar/ExecuteButton";
import NavigationTabs from "@/app/workflow/_components/topbar/NavigationTabs";
import PublishButton from "@/app/workflow/_components/topbar/PublishButton";

interface TopbarProps {
  title: string;
  subtitle?: string;
  workflowId: string;
  hideButtons?: boolean;
}

function Topbar({ title, subtitle, workflowId, hideButtons = false }: TopbarProps) {
  const router = useRouter();
  return (
    <header className="flex p-2 border-b-2 border-separate justify-between w-full h-[60px] sticky top-0 bg-background z-10">
      <div className="flex gap-1 flex-1">
        <TooltipWrapper content="Back">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeftIcon size="20" />
          </Button>
        </TooltipWrapper>
        <div>
          <p className="font-bold text-ellipsis truncate">{title}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground text-ellipsis truncate">{subtitle}</p>
          )}
        </div>
      </div>
      <NavigationTabs workflowId={workflowId} />
      <div className="flex gap-1 justify-end">
        {!hideButtons && (
          <>
            <ExecuteButton workflowId={workflowId} />
            <SaveButton workflowId={workflowId} />
            <PublishButton workflowId={workflowId} />
          </>
        )}
      </div>
    </header>
  );
}

export default Topbar;
