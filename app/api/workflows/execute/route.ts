import { timingSafeEqual } from "node:crypto";
import prisma from "@/lib/prisma";
import {
  ExecutionPhaseStatus,
  WorkFlowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
} from "@/types/workflow";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import parser from "cron-parser";

function isValidSecret(secret: string) {
  const API_SECRET = process.env.API_SECRET;
  if (!API_SECRET) {
    return false;
  }
  try {
    return timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECRET));
  } catch (e) {
    return false;
  }
}

export async function GET(request: Request) {
  const headers = request.headers.get("authorization");
  if (!headers || !headers.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = headers.split(" ")[1];
  console.log("secret", secret);
  if (!isValidSecret(secret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const workflowId = searchParams.get("workflowId") as string;

  if (!workflowId) {
    return Response.json({ error: "bad request WorkflowId is required" }, { status: 400 });
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
    },
  });

  if (!workflow) {
    return Response.json({ error: "Workflow not found" }, { status: 404 });
  }

  const executionPlan = JSON.parse(workflow.executionPlan!) as WorkFlowExecutionPlan;

  if (!executionPlan) {
    return Response.json({ error: "Workflow execution plan not found" }, { status: 404 });
  }

  try {
    const cron = parser.parseExpression(workflow.cron!, { utc: true });
    const nextRun = cron.next().toDate();

    const userId = workflow.userId;
    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId: workflowId,
        userId: userId,
        definition: workflow.definition,
        status: WorkflowExecutionStatus.PENDING,
        startedAt: new Date(),
        trigger: WorkflowExecutionTrigger.CRON,
        phases: {
          create: executionPlan.flatMap((phase) =>
            phase.nodes.flatMap((node) => ({
              userId,
              status: ExecutionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label,
            }))
          ),
        },
      },
    });

    await ExecuteWorkflow(execution.id, nextRun);
    return new Response(null, { status: 200 });
  } catch (e) {
    return Response.json({ error: "Invalid cron expression" }, { status: 400 });
  }
}
