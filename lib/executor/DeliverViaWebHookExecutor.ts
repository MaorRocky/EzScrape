import { ExecutionEnvironment } from "@/types/executor";

import { ClickElementTask } from "@/lib/workflow/task/ClickElement";
import { DeliverViaWebHookTask } from "@/lib/workflow/task/DeliverViaWebHook";

export async function DeliverViaWebHookExecutor(
  environment: ExecutionEnvironment<typeof DeliverViaWebHookTask>
): Promise<boolean> {
  try {
    const targetUrl = environment.getInput("Target URL");
    if (!targetUrl) {
      environment.log.error("Target Url is required");
      return false;
    }

    const body = environment.getInput("Body");
    if (!body) {
      environment.log.error("Input Body is required");
      return false;
    }

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const statusCode = response.status;
    if (statusCode != 200) {
      environment.log.error(
        `Failed to deliver via webhook to ${targetUrl}, status code: ${statusCode}`
      );
      return false;
    }

    environment.log.info(`Delivered via webhook to ${targetUrl}`);
    const responseBody = await response.json();
    environment.log.info(`Response: ${JSON.stringify(responseBody)}`);

    return true;
  } catch (error: any) {
    environment.log.error(`Error extracting text from element: ${error.message}`);
    return false;
  }
}
