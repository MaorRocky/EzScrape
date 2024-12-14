import { ExecutionEnvironment } from "@/types/executor";

import { WaitForElementTask } from "@/lib/workflow/task/WaitForElement";

export async function WaitForElementExecutor(
  environment: ExecutionEnvironment<typeof WaitForElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("Input Selector is required");
      return false;
    }
    const visibility = environment.getInput("Visibility")?.toLowerCase();
    if (!visibility) {
      environment.log.error("Input visibility is required");
      return false;
    }

    await environment.getPage()!.waitForSelector(selector, {
      visible: visibility === "visible",
      hidden: visibility === "hidden",
    });
    environment.log.info(`Element ${selector} is ${visibility}`);
    return true;
  } catch (error: any) {
    environment.log.error(`Error extracting text from element: ${error.message}`);
    return false;
  }
}
