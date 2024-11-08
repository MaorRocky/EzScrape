import { LaunchBrowserTask } from "@/lib/workflow/task/LuanchBrowser";
import { PageToHtmlTask } from "@/lib/workflow/task/PageToHtml";
import { ExtractTextFromElement } from "@/lib/workflow/task/ExtractTextFromElement";

export const TaskRegistry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElement,
};
