"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarIcon, TriangleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { UpdateWorkflowCron } from "@/actions/workflows/updateWorkflowCron";
import { toast } from "sonner";
import cronstrue from "cronstrue";

function SchedulerDialog({ workflowId }: { workflowId: string }) {
  const [cron, setCron] = useState("");
  const [validCron, setValidCron] = useState(false);
  const [readableCron, setreadableCron] = useState("");

  const mutation = useMutation({
    mutationFn: UpdateWorkflowCron,
    onSuccess: () => {
      toast.success("Schedule update successfully", { id: "cron" });
    },
    onError: (error) => {
      toast.error(error.message, { id: "cron" });
    },
  });

  useEffect(() => {
    try {
      const humanCronString = cronstrue.toString(cron);
      setValidCron(true);
      setreadableCron(humanCronString);
    } catch (error) {
      setValidCron(false);
    }
  }, [cron]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className={cn("text-sm p-0 h-auto")}>
          <div className="flex items-center gap-1">
            <TriangleIcon size="16" className="h-3 w-3" /> Set Schedule
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader title="Schedule Workflow Exceution" icon={CalendarIcon} />
        <div className="p-6 space-y-4">
          <p className="text-muted-foreground text-sm">
            Specify cron expression to schedule periodic workflow execution, all times are in UTS
          </p>
          <Input
            placeholder="E.g *.*.*.*.* "
            value={cron}
            onChange={(e) => setCron(e.target.value)}
          />
          <div
            className={cn(
              "bg-red-100 rounded-md p-4 border text-sm border-destructive text-destructive",
              validCron && "border-primary text-primary bg-green-100"
            )}>
            {validCron ? readableCron : "Not a valid cron expression"}
          </div>
        </div>
        <DialogFooter className="px-6 gap-2">
          <DialogClose asChild>
            <Button className="w-full" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              disabled={mutation.isPending}
              className="w-full"
              onClick={() => {
                toast.loading("Updating schedule...", { id: "cron" });
                mutation.mutate({ id: workflowId, cron });
              }}>
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SchedulerDialog;
