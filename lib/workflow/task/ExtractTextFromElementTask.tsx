import { TaskParamType, TaskType } from "@/types/task";
import { TextIcon, LucideProps } from "lucide-react";
import { WorkflowTask } from "@/types/workflow";

export const ExtractTextFromElementTask = {
  type: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
  label: "Extract Text From Element",
  icon: (props: LucideProps) => <TextIcon className="stroke-rose-500" {...props} />,
  isEntryPoint: false,
  inputs: [
    {
      name: "Html",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
    },
    {
      name: "Selector",
      type: TaskParamType.STRING,
      required: true,
    },
  ],
  outputs: [
    {
      name: "Extracted Text",
      type: TaskParamType.STRING,
    },
  ],
  credits: 5,
} satisfies WorkflowTask;
