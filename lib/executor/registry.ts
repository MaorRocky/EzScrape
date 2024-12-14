import { LaunchBrowserExecutor } from "@/lib/executor/LaunchBrowserExecutor";
import { PageToHtmlExecutor } from "@/lib/executor/PageToHtmlExecutor";
import { TaskType } from "@/types/task";
import { ExecutionEnvironment } from "@/types/executor";
import { WorkflowTask } from "@/types/workflow";
import { ExtractTextFromElementExecutor } from "@/lib/executor/ExtractTextFromElementExecutor";
import { FillInputExecutor } from "@/lib/executor/FillInputExecutor";
import { ClickElementExecutor } from "@/lib/executor/ClickElementExecutor";
import { WaitForElementExecutor } from "@/lib/executor/WaitForElementExecutor";
import { DeliverViaWebHookExecutor } from "@/lib/executor/DeliverViaWebHookExecutor";

type ExecutorFn<T extends WorkflowTask> = (ExecutorFn: ExecutionEnvironment<T>) => Promise<boolean>;
type RegistryType = {
  [K in TaskType]: ExecutorFn<WorkflowTask & { type: K }>;
};

export const ExecutorRegistry: RegistryType = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
  FILL_INPUT: FillInputExecutor,
  CLICK_ELEMENT: ClickElementExecutor,
  WAIT_FOR_ELEMENT: WaitForElementExecutor,
  DELIVER_VIA_WEBHOOK: DeliverViaWebHookExecutor,
};
