import { ExecutionEnvironment } from "@/types/executor";

import { FillInputTask } from "@/lib/workflow/task/FillInput";

export async function FillInputExecutor(
  environment: ExecutionEnvironment<typeof FillInputTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("Input Selector is required");
      return false;
    }
    const value = environment.getInput("Value");
    if (!value) {
      environment.log.error("Input Value is required");
      return false;
    }

    await environment.getPage()!.type(selector, value);

    return true;
  } catch (error: any) {
    environment.log.error(`Error extracting text from element: ${error.message}`);
    return false;
  }
}
