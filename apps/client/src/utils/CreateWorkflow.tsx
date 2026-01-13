import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { TriggerSheet } from "./TriggerSheet";
import { ActionSelectorSheet } from "./ActionSelectorSheet";
import { PriceTrigger } from "@/nodes/triggers/PriceTrigger";
import { Timer } from "@/nodes/triggers/Timer";
import { Lighter } from "@/nodes/actions/Lighter";
import { Hyperliquid } from "@/nodes/actions/Hyperliquid";
import { Backpack } from "@/nodes/actions/Backpack";
import type { EdgeType, NodeType } from "common/types";
import { TransferAsset } from "@/nodes/actions/TransferAsset";
import { Button } from "@/components/ui/button";

// Component that will handle all the workflow creation process
function Flow() {
  const { screenToFlowPosition } = useReactFlow();

  // State variables to handle the states of nodes in the canvas
  const [nodes, setNodes] = useState<NodeType[]>([]);

  // State variables to handle the states of edges in the canvas
  const [edges, setEdges] = useState<EdgeType[]>([]);

  // State variables to handle the state of the action sheet
  const [selectAction, setSelectAction] = useState<{
    position: {
      x: number;
      y: number;
    };
    startingNodeId: string;
  } | null>(null);

  // Runs the following callback function on a node's change
  const onNodesChange = useCallback(
    (changes: any) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );

  // Runs the following callback function on a edge's change
  const onEdgesChange = useCallback(
    (changes: any) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );

  // Runs the following callback function on connecting an edge to a node
  const onConnect = useCallback(
    (params: any) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  // Runs the following callback function on connecting an edge to a node
  const onConnectEnd = useCallback(
    (event: any, connectionInfo: any) => {
      // If the edge is connected is left open in the canvas it opens the action sheet
      if (!connectionInfo.isValid) {
        // Gets the position of the mouse cursor
        const { clientX, clientY } = event;

        // Converts the position of the mouse cursor to the position of the node in the canvas
        const position = screenToFlowPosition({ x: clientX, y: clientY });

        setSelectAction({
          position,
          startingNodeId: connectionInfo.fromNode.id,
        });
      }
    },
    [screenToFlowPosition]
  );

  // Variables to store node-types, being sent to Reactflow component
  const nodeTypes = {
    "price-trigger": PriceTrigger,
    "timer": Timer,
    "lighter": Lighter,
    "backpack": Backpack,
    "hyperliquid": Hyperliquid,
    "asset-transfer": TransferAsset,
  };

  async function saveWorkflow(nodes: NodeType[], edges: EdgeType[]) {
    const payload = {
      name: "Dummy Workflow",

      nodeProperties: nodes.map((node) => ({
        nodeID: node.id,
        nodeType: node.type,
        metadata: node.data.metadata,
        position: node.position,
      })),

      edges: edges.map((edge) => ({
        edgeId: edge.id,
        source: edge.source,
        target: edge.target,
      })),
    };

    console.log("Posting - " + payload);

    // TODO!
    // const token = localStorage.getItem("token");
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2OTY1Mzc2NTk5NGUwMmNlOTI4ZjJhMmMiLCJpYXQiOjE3NjgyNDEwMjZ9.v0eeUKVQw1UQycBcIbnar_He7OczaBrso7tgICn_Wxs";

    const response = await fetch("http://localhost:2099/workflow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to save");

    const result = await response.json();
    alert(`Workflow saved! ID: ${result.workflowId}`);
  }

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Wallet connect button in top-right corner */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 10,
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <Button
          variant="secondary"
          onClick={() => saveWorkflow(nodes, edges)}
          style={{
            height: "48px",
            backgroundColor: "white",
            color: "#1a1a1a",
            borderRadius: "4px",
            fontWeight: 900,
          }}
        >
          Submit Workflow
        </Button>
        <WalletMultiButton />
      </div>

      {/* If there are no nodes present on the canvas it triggers a sheet to appear on RHS to select the type of trigger as the first node */}
      {!nodes.length && (
        <TriggerSheet
          onSelectHandler={(type, metadata) => {
            setNodes([
              ...nodes,
              {
                id: Math.random().toString(),
                type,
                data: {
                  kind: "trigger",
                  metadata,
                },
                position: {
                  x: 0,
                  y: 0,
                },
              },
            ]);
          }}
        />
      )}

      {/* If the state of selectionAction is not null it triggers a sheet to appear on RHS to select the type of action as the second node */}
      {selectAction && (
        <ActionSelectorSheet
          onSelectHandler={(type, metadata) => {
            const id = Math.random().toString();

            // Adds the action node to the canvas
            setNodes([
              ...nodes,
              {
                id,
                type,
                data: {
                  kind: "action",
                  metadata,
                },
                position: selectAction.position,
              },
            ]);

            // Adds the edge to the canvas
            setEdges([
              ...edges,
              {
                id: `${selectAction.startingNodeId}-${id}`,
                source: selectAction.startingNodeId,
                target: id,
              },
            ]);

            // Resets the state of selectionAction
            setSelectAction(null);
          }}
          onClose={() => setSelectAction(null)}
        />
      )}

      {/* The ReactFlow component that renders the canvas */}
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        fitView
      />
    </div>
  );
}

// Component to wrap the Flow component to provide the ReactFlow context
export function CreateWorkflow() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
