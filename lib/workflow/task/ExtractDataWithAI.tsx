import { TaskParamType, TaskType } from "@/types/task";
import { BrainIcon, LucideProps, MousePointerClick } from "lucide-react";
import { WorkflowTask } from "@/types/workflow";

export const ExtractDataWithAITask = {
  type: TaskType.EXTRACT_DATA_WITH_AI,
  label: "Extract Data With AI",
  icon: (props: LucideProps) => <BrainIcon className="stroke-rose-500" {...props} />,
  isEntryPoint: false,
  inputs: [
    {
      name: "Content",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: true,
    },
    {
      name: "Prompt",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
    },
  ] as const,
  outputs: [
    {
      name: "Extracted Data",
      type: TaskParamType.STRING,
    },
  ] as const,
  credits: 2,
} satisfies WorkflowTask;
