import { ExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromElementTask } from "@/lib/workflow/task/ExtractTextFromElementTask";
import { load } from "cheerio";

export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("Selector not found");
      return false;
    }
    const html = environment.getInput("Html");
    if (!html) {
      environment.log.error("Html not found");
      return false;
    }
    const $ = load(html);
    const element = $(selector);

    if (element.length === 0) {
      environment.log.error("Element not found");
      return false;
    }
    const text = element.text();

    if (!text) {
      environment.log.error("Text not found");
      return false;
    }

    environment.setOutput("Extracted Text", text);
    return true;
  } catch (error: any) {
    environment.log.error(`Error extracting text from element: ${error.message}`);
    return false;
  }
}
