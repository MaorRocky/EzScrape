"use server";

import { duplicateWorkflowSchema, DuplicateWorkflowSchemaType } from "@/schema/workflows";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { revalidatePath } from "next/cache";

export async function DuplicateWorkflow(form: DuplicateWorkflowSchemaType) {
  const { success, data } = duplicateWorkflowSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      userId,
      id: data.workflowId,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  const result = await prisma.workflow.create({
    data: {
      name: data.name,
      description: workflow.description,
      definition: workflow.definition,
      status: WorkflowStatus.DRAFT,
      userId,
    },
  });

  if (!result) {
    throw new Error("Failed to duplicate workflow");
  }

  revalidatePath("/workflows");
}
