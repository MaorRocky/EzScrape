import { TaskParamType, TaskType } from "@/types/task";
import { LucideProps, SendIcon } from "lucide-react";
import { WorkflowTask } from "@/types/workflow";

export const DeliverViaWebHookTask = {
  type: TaskType.DELIVER_VIA_WEBHOOK,
  label: "Deliver Via WebHook ",
  icon: (props: LucideProps) => <SendIcon className="stroke-blue-500" {...props} />,
  isEntryPoint: false,
  inputs: [
    {
      name: "Target URL",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Body",
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: "Response",
      type: TaskParamType.STRING,
    },
  ] as const,
  credits: 1,
} satisfies WorkflowTask;
