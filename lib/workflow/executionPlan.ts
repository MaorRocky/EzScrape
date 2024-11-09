import { Edge, getIncomers } from "@xyflow/react";
import { AppNode } from "@/types/appNode";
import {
  WorkFlowExecutionPlan,
  WorkFlowExecutionPlanPhase,
} from "@/types/workflow";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { TaskParam } from "@/types/task";

type FlowToExecutionPlan = {
  executionPlan?: WorkFlowExecutionPlan;
};

function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
  const invalidInputs = [];
  const inputs: TaskParam[] = TaskRegistry[node.data.type].inputs;

  for (const input of inputs) {
    const inputValue = node.data.inputs[input.name];
    const inputValueProvided = inputValue?.length > 0;

    if (inputValueProvided) {
      continue;
    }

    const incomingEdges = edges.filter(
      (edge) => edge.target === node.id && !planned.has(edge.source)
    );

    const inputLinkedToOutput = incomingEdges.find(
      (edge) => edge.targetHandle === input.name
    );

    const requiredInputProvidedBVisitedOutput =
      input.required &&
      inputLinkedToOutput &&
      planned.has(inputLinkedToOutput.source);

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

export function FlowToExecutionPlan(
  nodes: AppNode[],
  edges: Edge[]
): FlowToExecutionPlan {
  const entryPoint = nodes.find(
    (node) => TaskRegistry[node.data.type].isEntryPoint
  );

  if (!entryPoint) {
    throw new Error("No entry point found");
  }
  const planned = new Set<string>();
  const executionPlan: WorkFlowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];

  for (
    let phase = 2;
    phase < nodes.length || planned.size < nodes.length;
    phase++
  ) {
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
          console.error(
            `Node ${currentNode.id} has invalid inputs, invalid inputs {invalidInputs}`
          );
          throw new Error("TODO: HANDLE ERROR 1");
        } else {
          continue;
        }
      }
      nextPhase.nodes.push(currentNode);
      planned.add(currentNode.id);
    }
  }
  return { executionPlan };
}
