import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  ReactFlowProvider,
  useReactFlow,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type OnConnectEnd,
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
import { useAuthWithRedirect } from "@/hooks/useAuth";
import { Sidebar, type Workflow } from "@/components/Sidebar";
import { Menu } from "lucide-react";
import { useEffect } from "react";

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

  const { token, logoutAndRedirect } = useAuthWithRedirect();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loadingWorkflows, setLoadingWorkflows] = useState(false);

  const fetchWorkflows = useCallback(async () => {
    if (!token) return;
    setLoadingWorkflows(true);

    try {
      const res = await fetch("http://localhost:2099/workflow", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setWorkflows(data.workflow);
      }
    } catch (e) {
      console.error("Failed to fetch workflows", e);
    } finally {
      setLoadingWorkflows(false);
    }
  }, [token]);

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  const loadWorkflow = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:2099/workflow/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const wf = data.workflow;
        if (!wf) return;

        const loadedNodes: NodeType[] = wf.nodeProperties.map(
          (np: {
            nodeID: string;
            nodeType: string;
            metadata: unknown;
            position: { x: number; y: number };
          }) => {
            let kind: "trigger" | "action" = "action";
            if (np.nodeType === "price-trigger" || np.nodeType === "timer") {
              kind = "trigger";
            }
            return {
              id: np.nodeID,
              type: np.nodeType,
              data: {
                kind,
                metadata: np.metadata,
              },
              position: np.position,
            };
          },
        );

        const loadedEdges: EdgeType[] = wf.edges.map(
          (e: { edgeId: string; source: string; target: string }) => ({
            id: e.edgeId,
            source: e.source,
            target: e.target,
          }),
        );

        setNodes(loadedNodes);
        setEdges(loadedEdges);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Runs the following callback function on a node's change
  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes(
        (nodesSnapshot) =>
          applyNodeChanges(changes, nodesSnapshot) as NodeType[],
      ),
    [],
  );

  // Runs the following callback function on a edge's change
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );

  // Runs the following callback function on connecting an edge to a node
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  // Runs the following callback function on connecting an edge to a node
  const onConnectEnd: OnConnectEnd = useCallback(
    (event, connectionInfo) => {
      // If the edge is connected is left open in the canvas it opens the action sheet
      if (!connectionInfo.isValid) {
        // Gets the position of the mouse cursor
        const clientX =
          "changedTouches" in event
            ? event.changedTouches[0].clientX
            : event.clientX;
        const clientY =
          "changedTouches" in event
            ? event.changedTouches[0].clientY
            : event.clientY;

        // Converts the position of the mouse cursor to the position of the node in the canvas
        const position = screenToFlowPosition({ x: clientX, y: clientY });

        if (!connectionInfo.fromNode) return;

        setSelectAction({
          position,
          startingNodeId: connectionInfo.fromNode.id,
        });
      }
    },
    [screenToFlowPosition],
  );

  // Variables to store node-types, being sent to Reactflow component
  const nodeTypes = {
    "price-trigger": PriceTrigger,
    timer: Timer,
    lighter: Lighter,
    backpack: Backpack,
    hyperliquid: Hyperliquid,
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

    const cleanToken = token?.replace(/^['"]+|['"]+$/g, "");

    if (!cleanToken) {
      alert("Please login first");
      return;
    }

    const response = await fetch("http://localhost:2099/workflow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cleanToken}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to save");

    const result = await response.json();
    alert(`Workflow saved! ID: ${result.workflowId}`);
    fetchWorkflows(); // Refresh list
  }

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Wallet connect button in top-right corner */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 10,
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className="bg-white/90 hover:bg-white text-black border border-gray-200"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        workflows={workflows}
        onSelectWorkflow={loadWorkflow}
        isLoading={loadingWorkflows}
      />

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
        <Button
          onClick={logoutAndRedirect}
          style={{
            height: "48px",
            backgroundColor: "#ef4444",
            color: "white",
            borderRadius: "4px",
            fontWeight: 900,
          }}
        >
          Sign Out
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
