"use client";
import React, { useCallback, useEffect } from "react";
import { Workflow } from "@prisma/client";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  getOutgoers,
  MarkerType,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/task";
import NodeComponent from "@/app/workflow/_components/nodes/NodeComponent";
import { AppNode } from "@/types/appNode";
import DeleteableEdge from "@/app/workflow/_components/edges/DeleteableEdge";
import { TaskRegistry } from "@/lib/workflow/task/Registry";

const nodeTypes = {
  FlowScrapeNode: NodeComponent,
};

const edgeTypes = {
  default: DeleteableEdge,
};

const snapGrid: [number, number] = [30, 30];
const fitViewOptions = {
  padding: 1,
};

function FlowEditor({ workflow }: { workflow: Workflow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition);
      if (!flow) return;

      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      if (!flow.viewport) {
        return;
      }
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setViewport({ x, y, zoom });
    } catch (error) {
      console.log(error);
    }
  }, [workflow.definition, setEdges, setNodes, setViewport]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((prevEdges) =>
        addEdge(
          {
            ...connection,
            animated: true,
          },
          prevEdges
        )
      );
      if (!connection.targetHandle) {
        return;
      }

      //remove input value if its present in the target node
      const targetNode = nodes.find((node) => node.id === connection.target);
      if (!targetNode) {
        return;
      }

      const nodeInputs = targetNode.data?.inputs || [];

      updateNodeData(targetNode.id, {
        inputs: { ...nodeInputs, [connection.targetHandle]: "" },
      });
    },
    [nodes, setEdges, updateNodeData]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const taskType = event.dataTransfer.getData("application/reactflow");
      if (typeof taskType === undefined || !taskType) return;

      //add position to the node
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const node = CreateFlowNode(taskType as TaskType, position);
      setNodes((prevNodes) => prevNodes.concat(node));
    },
    [screenToFlowPosition, setNodes]
  );

  const isValidConnection = useCallback(
    (connection: Edge | Connection) => {
      // No self connections allowed
      if (connection.source === connection.target) {
        return false;
      }

      // same taskParam type connections are not allowed
      const sourceNode = nodes.find((node) => node.id === connection.source);
      const targetNode = nodes.find((node) => node.id === connection.target);

      if (!sourceNode || !targetNode) {
        console.error("source or target node not found");
        return false;
      }

      const sourceTask = TaskRegistry[sourceNode.data.type];
      const targetTask = TaskRegistry[targetNode.data.type];

      const output = sourceTask.outputs.find(
        (output) => output.name === connection.sourceHandle
      );

      const input = targetTask.inputs.find(
        (input) => input.name === connection.targetHandle
      );

      if (input?.type !== output?.type) {
        console.error("input and output type mismatch");
        return false;
      }

      // no cyclic connections allowed
      const hasCycle = (
        node: AppNode,
        visited: Set<string> = new Set<string>()
      ) => {
        if (visited.has(node.id)) return false;

        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };

      const detectedCycle = hasCycle(targetNode);

      return !detectedCycle;
    },
    [edges, nodes]
  );

  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid
        snapGrid={snapGrid}
        fitViewOptions={fitViewOptions}
        fitView
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={2} />
      </ReactFlow>
    </main>
  );
}

export default FlowEditor;
