import { ExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromElementTask } from "@/lib/workflow/task/ExtractTextFromElementTask";
import { load } from "cheerio";

export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
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
    const text = $.text(element);
    if (!text) {
      console.error("Text not found");
      return false;
    }
    environment.setOutput("Extracted Text", text);
    console.log("Extracted text", text);
    return true;
  } catch (error) {
    console.error("Error executing", error);
    return false;
  }
}
