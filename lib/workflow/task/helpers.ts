import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "@/lib/workflow/task/Registry";

export function CalculateWorkflowCost(nodes: AppNode[]) {
  return nodes.reduce((acc, node) => {
    return acc + TaskRegistry[node.data.type].credits;
  }, 0);
}
