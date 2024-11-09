import { TaskParamType, TaskType } from "@/types/task";
import { CodeIcon, LucideProps } from "lucide-react";
import {WorkflowTask} from "@/types/workflow";

export const PageToHtmlTask = {
  type: TaskType.PAGE_TO_HTML,
  label: "Get Html From Page",
  icon: (props: LucideProps) => (
    <CodeIcon className="stroke-pink-500" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Web Page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
  ],
  outputs: [
    {
      name: "Html",
      type: TaskParamType.STRING,
    },
    { name: "Web Page", type: TaskParamType.BROWSER_INSTANCE },
  ],
  credits: 5,
} satisfies WorkflowTask;
