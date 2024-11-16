"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { WorkFlowExecutionPlan } from "@/types/workflow";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";

export async function RunWorkFlow(form: { workflowId: string; flowDefinition?: string }) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const { workflowId, flowDefinition } = form;

  if (!workflowId) {
    throw new Error("workflowId is required");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      userId,
      id: workflowId,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  let executionPlan: WorkFlowExecutionPlan;
  if (!flowDefinition) {
    throw new Error("flowDefinition is required");
  }

  const flow = JSON.parse(flowDefinition);
  const result = FlowToExecutionPlan(flow.nodes, flow.edges);
  if (result.error) {
    throw new Error("Invalid flow definition");
  }

  if (!result.executionPlan) {
    throw new Error("no execution plan generated");
  }

  executionPlan = result.executionPlan;
  console.log("executionPlan", executionPlan);
}
