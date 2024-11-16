import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GetWorkFlowExecutionWithPhases(executionId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  return prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
      userId,
    },
    include: {
      phases: {
        orderBy: {
          number: "asc",
        },
      },
    },
  });
}
