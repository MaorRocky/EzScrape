import { TaskParamType, TaskType } from "@/types/task";
import { Edit3Icon, LucideProps } from "lucide-react";
import { WorkflowTask } from "@/types/workflow";

export const FillInputTask = {
  type: TaskType.FILL_INPUT,
  label: "Fill Input",
  icon: (props: LucideProps) => <Edit3Icon className="stroke-orange-500" {...props} />,
  isEntryPoint: false,
  inputs: [
    {
      name: "Web Page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: "Selector",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Value",
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,
  outputs: [{ name: "Web Page", type: TaskParamType.BROWSER_INSTANCE }] as const,
  credits: 1,
} satisfies WorkflowTask;
