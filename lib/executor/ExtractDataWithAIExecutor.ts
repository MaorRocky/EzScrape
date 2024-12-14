import { ExecutionEnvironment } from "@/types/executor";

import { ExtractDataWithAITask } from "@/lib/workflow/task/ExtractDataWithAI";
import prisma from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";
import { mock } from "node:test";

export async function ExtractDataWithAIExecutor(
  environment: ExecutionEnvironment<typeof ExtractDataWithAITask>
): Promise<boolean> {
  try {
    const credentials = environment.getInput("Credentials");
    if (!credentials) {
      environment.log.error("Input credentials is required");
      return false;
    }
    const prompt = environment.getInput("Prompt");
    if (!prompt) {
      environment.log.error("Input Prompt is required");
      return false;
    }

    const content = environment.getInput("Content");
    if (!content) {
      environment.log.error("Input Content is required");
      return false;
    }

    const credential = await prisma.credential.findUnique({
      where: {
        id: credentials,
      },
    });

    if (!credential) {
      environment.log.error("credentials not found");
      return false;
    }

    const plainCredentialValue = symmetricDecrypt(credential.value);
    if (!plainCredentialValue) {
      environment.log.error("Error decrypting credential value");
      return false;
    }
    const mock = { data: "mock" };

    environment.setOutput("Extracted Data", JSON.stringify(mock));

    return true;
  } catch (error: any) {
    environment.log.error(`Error extracting text from element: ${error.message}`);
    return false;
  }
}
