import { LaunchBrowserTask } from "@/lib/workflow/task/LuanchBrowser";
import { PageToHtmlTask } from "@/lib/workflow/task/PageToHtml";
import { ExtractTextFromElementTask } from "@/lib/workflow/task/ExtractTextFromElementTask";
import { TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { FillInputTask } from "@/lib/workflow/task/FillInput";
import { ClickElementTask } from "@/lib/workflow/task/ClickElement";
import { WaitForElementTask } from "@/lib/workflow/task/WaitForElement";
import { DeliverViaWebHookTask } from "@/lib/workflow/task/DeliverViaWebHook";

type Registry = {
  [K in TaskType]: WorkflowTask & { type: K };
};

export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
  FILL_INPUT: FillInputTask,
  CLICK_ELEMENT: ClickElementTask,
  WAIT_FOR_ELEMENT: WaitForElementTask,
  DELIVER_VIA_WEBHOOK: DeliverViaWebHookTask,
};
