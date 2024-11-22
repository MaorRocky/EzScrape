import { ExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromElementTask } from "@/lib/workflow/task/ExtractTextFromElementTask";
import { load } from "cheerio";

export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      console.error("Selector not found");
      return false;
    }
    const html = environment.getInput("Html");
    if (!html) {
      console.error("Html not found");
      return false;
    }
    const $ = load(html);
    const element = $(selector);

    if (!element) {
      console.error("Element not found");
      return false;
    }
    const text = element.text();
    environment.setOutput("Extracted Text", text);
    return true;
  } catch (error) {
    console.error("Error executing", error);
    return false;
  }
}
