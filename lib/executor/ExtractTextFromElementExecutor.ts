import { ExecutionEnvironment } from "@/types/executor";
import { PageToHtmlTask } from "@/lib/workflow/task/PageToHtml";
import { ExtractTextFromElementTask } from "@/lib/workflow/task/ExtractTextFromElementTask";

export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>
): Promise<boolean> {
  try {
    return true;
  } catch (error) {
    console.error("Error executing", error);
    return false;
  }
}
