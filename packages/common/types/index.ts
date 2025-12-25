import type { ActionNodeMetadata, PriceTriggerMetadata, TimerTriggerMetadata } from "../metadata";

// The type of triggers we support on an empty canvas
type TriggerType = "action" | "trigger"

// The kinds of nodes a user can add on the canvas
export type NodeKind = "price-trigger" | "timer" | "hyperliquid" | "backpack" | "lighter"

// Metadata for the node storing info about the task its performing
export type NodeMetadata = ActionNodeMetadata | TimerTriggerMetadata | PriceTriggerMetadata;

// Data structure for the node being used in the workflow
export interface NodeType {
    id: string,
    type: NodeKind,
    data: {
        kind: TriggerType,
        metadata: NodeMetadata,
    },
    position: {
        x: number,
        y: number
    },
}

// Data structure for the edges being used in the workflow
export interface EdgeType {
    id: string,
    source: string,
    target: string
}
