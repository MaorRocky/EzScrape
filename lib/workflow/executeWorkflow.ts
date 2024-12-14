import "server-only";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from "@/types/workflow";
import { ExecutionPhase } from "@prisma/client";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { ExecutorRegistry } from "@/lib/executor/registry";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { TaskParamType } from "@/types/task";
import { Page } from "puppeteer";
import { Edge } from "@xyflow/react";
import { LogCollector } from "@/types/log";
import { createLogCollector } from "@/lib/log";

export async function ExecuteWorkflow(executionId: string, nextRunAt?: Date) {
  const execution = await prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
    },
    include: {
      workflow: true,
      phases: true,
    },
  });

  if (!execution) {
    throw new Error("Execution not found");
  }
  const edges = JSON.parse(execution.definition).edges as Edge[];
  const environment: Environment = { phases: {} };

  await initializeWorkflowExecution(executionId, execution.workflowId, nextRunAt);
  await initializePhaseStatuses(execution);

  let creditsConsumed = 0;
  let executionFailed = false;
  for (const phase of execution.phases) {
    const phaseExecution = await executeWorkflowPhase(phase, environment, edges);

    creditsConsumed += phaseExecution.creditsConsumed;
    if (!phaseExecution.success) {
      executionFailed = true;
      break;
    }
  }

  await finalizeWorkflowExecution(
    executionId,
    execution.workflowId,
    executionFailed,
    creditsConsumed
  );

  await cleanUpEnvironment(environment);

  revalidatePath("/workflow/runs/");
}

async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string,
  nextRunAt?: Date
) {
  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      startedAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING,
    },
  });

  await prisma.workflow.update({
    where: { id: workflowId },
    data: {
      lastRunAt: new Date(),
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
      lastRunId: executionId,
      ...(nextRunAt && { nextRunAt }),
    },
  });
}

async function initializePhaseStatuses(execution: any) {
  await prisma.executionPhase.updateMany({
    where: {
      id: { in: execution.phases.map((phase: any) => phase.id) },
    },
    data: {
      status: WorkflowExecutionStatus.PENDING,
    },
  });
}

async function finalizeWorkflowExecution(
  executionId: string,
  workflowId: string,
  executionFailed: boolean,
  creditsConsumed: number
) {
  const finalStatus = executionFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;

  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed,
    },
  });

  await prisma.workflow
    .update({
      where: { id: workflowId, lastRunId: executionId },
      data: {
        lastRunStatus: finalStatus,
      },
    })
    .catch((err) => {
      console.error("Failed to update workflow last run status", err);
    });
}

function createExecutionEnvironment(
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): ExecutionEnvironment<any> {
  return {
    getInput(name: string) {
      return environment.phases[node.id]?.inputs[name];
    },
    getBrowser: () => environment.browser,
    setBrowser: (browser: any) => {
      environment.browser = browser;
    },
    getPage: () => environment.page,
    setPage: (page: Page) => {
      environment.page = page;
    },
    setOutput(name: string, value: string) {
      environment.phases[node.id].outputs[name] = value;
    },
    log: logCollector,
  };
}

async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): Promise<boolean> {
  const runFn = ExecutorRegistry[node.data.type];
  if (!runFn) {
    logCollector.error(`Executor not found for task type ${node.data.type}`);
    return false;
  }

  const executionEnvironment: ExecutionEnvironment<any> = createExecutionEnvironment(
    node,
    environment,
    logCollector
  );

  return await runFn(executionEnvironment);
}

async function executeWorkflowPhase(
  phase: ExecutionPhase,
  environment: Environment,
  edges: Edge[]
) {
  const logCollector = createLogCollector();
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;

  setupEnvironmentPhase(node, environment, edges);

  await prisma.executionPhase.update({
    where: { id: phase.id },
    data: {
      startedAt,
      status: ExecutionPhaseStatus.RUNNING,
      inputs: JSON.stringify(environment.phases[node.id].inputs),
    },
  });

  const creditsRequired = TaskRegistry[node.data.type].credits;
  let success = await decrementUserCredits(phase.userId, creditsRequired, logCollector);
  const creditsConsumed = success ? creditsRequired : 0;
  if (success) {
    success = await executePhase(phase, node, environment, logCollector);
  }

  const outputs = environment.phases[node.id].outputs;
  await finalizePhase(phase.id, success, outputs, logCollector, creditsConsumed);

  return { success, creditsConsumed };
}

async function finalizePhase(
  phaseId: string,
  success: boolean,
  outputs: any,
  logCollector: LogCollector,
  creditsConsumed: number
) {
  const status = success ? ExecutionPhaseStatus.COMPLETED : ExecutionPhaseStatus.FAILED;
  const endedAt = new Date();

  await prisma.executionPhase.update({
    where: { id: phaseId },
    data: {
      status,
      completedAt: endedAt,
      outputs: JSON.stringify(outputs),
      creditsConsumed,
      logs: {
        createMany: {
          data: logCollector.getAll().map((log) => ({
            logLevel: log.level,
            message: log.message,
            timestamp: log.timestamp,
          })),
        },
      },
    },
  });
}

function setupEnvironmentPhase(node: AppNode, environment: Environment, edges: Edge[]) {
  environment.phases[node.id] = {
    inputs: {},
    outputs: {},
  };
  const inputs = TaskRegistry[node.data.type].inputs;
  for (const input of inputs) {
    if (input.type === TaskParamType.BROWSER_INSTANCE) {
      continue;
    }
    const inputValue = node.data.inputs[input.name];
    if (inputValue) {
      environment.phases[node.id].inputs[input.name] = inputValue;
      continue;
    }

    // get input value from the output
    const connectedEdge = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name
    );

    if (!connectedEdge) {
      console.error(`missing edge for input ${input.name} in node ${node.id}`);
      continue;
    }

    environment.phases[node.id].inputs[input.name] =
      environment.phases[connectedEdge.source].outputs[connectedEdge.sourceHandle!];
  }
}

async function cleanUpEnvironment(environment: Environment) {
  if (environment.browser) {
    await environment.browser.close().catch((err) => {
      console.error("Failed to close browser", err);
    });
  }
}

async function decrementUserCredits(userId: string, amount: number, logCollector: LogCollector) {
  try {
    // Fetch the user's current credit balance
    const user = await prisma.userBalance.findUnique({
      where: { userId },
    });

    if (!user) {
      const errorMessage = `User with ID ${userId} not found.`;
      console.error(errorMessage);
      logCollector.error(errorMessage);
      return false;
    }

    if (user.credits < amount) {
      const insufficientCreditsMessage = `You do not have enough credits. Required: ${amount}, Available: ${user.credits}`;
      logCollector.error(insufficientCreditsMessage);
      return false;
    }

    // Decrement the user's credits
    await prisma.userBalance.update({
      where: { userId },
      data: {
        credits: {
          decrement: amount,
        },
      },
    });
  } catch (err) {
    const errorMessage = "Failed to decrement user credits";
    console.error(errorMessage, err);
    logCollector.error(errorMessage);
    return false;
  }

  return true;
}
