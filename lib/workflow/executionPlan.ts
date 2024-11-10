import { Edge, getIncomers } from "@xyflow/react";
import { AppNode, AppNodeMissingInputs } from "@/types/appNode";
import { WorkFlowExecutionPlan, WorkFlowExecutionPlanPhase } from "@/types/workflow";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { TaskParam } from "@/types/task";

export enum FlowToExecutionPlanValidationError {
  NO_ENTRY_POINTS = "NO_ENTRY_POINTS",
  INVALID_OUTPUTS = "INVALID_OUTPUTS",
}

type FlowToExecutionPlanType = {
  executionPlan?: WorkFlowExecutionPlan;
  error?: {
    type: FlowToExecutionPlanValidationError;
    invalidElements?: AppNodeMissingInputs[];
  };
};

function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>): TaskParam[] {
  const invalidInputs = [];
  const inputs: TaskParam[] = TaskRegistry[node.data.type].inputs;

  for (const input of inputs) {
    const inputValue = node.data.inputs[input.name];
    const inputValueProvided = inputValue?.length > 0;

    if (inputValueProvided) {
      continue;
    }

    const incomingEdges = edges.filter((edge) => edge.target === node.id);

    const inputLinkedToOutput = incomingEdges.find((edge) => edge.targetHandle === input.name);

    const requiredInputProvidedBVisitedOutput =
      input.required && inputLinkedToOutput && planned.has(inputLinkedToOutput.source);

    if (requiredInputProvidedBVisitedOutput) {
      // the inputs are required and the input is provided by a visited output
      // we have a valid value for it
      // provided by a task that is already planned
      continue;
    } else if (!input.required) {
      if (!inputLinkedToOutput) {
        continue;
      }
      if (inputLinkedToOutput && planned.has(inputLinkedToOutput.source)) {
        // the output is providing a value and the output is already planned
        continue;
      }
    }

    invalidInputs.push(input);
  }
  return invalidInputs;
}

export function FlowToExecutionPlan(nodes: AppNode[], edges: Edge[]): FlowToExecutionPlanType {
  const entryPoint = nodes.find((node) => TaskRegistry[node.data.type].isEntryPoint);

  if (!entryPoint) {
    console.error("No entry point found");
    return {
      error: {
        type: FlowToExecutionPlanValidationError.NO_ENTRY_POINTS,
      },
    };
  }
  const inputsWitErrors: AppNodeMissingInputs[] = [];
  const planned = new Set<string>();

  const invalidInputs = getInvalidInputs(entryPoint, edges, planned);
  if (invalidInputs.length > 0) {
    inputsWitErrors.push({
      nodeId: entryPoint.id,
      inputs: invalidInputs.map((input) => input.name),
    });
  }

  const executionPlan: WorkFlowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];

  planned.add(entryPoint.id);
  for (let phase = 2; phase <= nodes.length && planned.size < nodes.length; phase++) {
    const nextPhase: WorkFlowExecutionPlanPhase = { phase, nodes: [] };
    for (const currentNode of nodes) {
      if (planned.has(currentNode.id)) {
        //node already planned
        continue;
      }
      const invalidInputs = getInvalidInputs(currentNode, edges, planned);

      if (invalidInputs.length > 0) {
        const incomers = getIncomers(currentNode, nodes, edges);

        if (incomers.every((incomer) => planned.has(incomer.id))) {
          // all incomers are planned and still invalid inputs
          // this means we have invalid inputs
          console.error("invalid inputs", currentNode.id, invalidInputs);
          inputsWitErrors.push({
            nodeId: currentNode.id,
            inputs: invalidInputs.map((input) => input.name),
          });
        } else {
          continue;
        }
      }
      nextPhase.nodes.push(currentNode);
    }
    for (const node of nextPhase.nodes) {
      planned.add(node.id);
    }
    executionPlan.push(nextPhase);
  }
  if (inputsWitErrors.length > 0) {
    return {
      error: {
        type: FlowToExecutionPlanValidationError.INVALID_OUTPUTS,
        invalidElements: inputsWitErrors,
      },
    };
  }

  return { executionPlan };
}
