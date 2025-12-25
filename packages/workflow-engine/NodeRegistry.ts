import type { INodeType } from "workflow-core";

/**
 * Class representing the registry of nodes in the workflow.
 * This is used to store and retrieve nodes during execution.
 */
export class NodeRegistry {
    /**
     * The registry of nodes.
     */
    private nodes: Record<string, INodeType> = {};

    /**
     * Registers a node in the registry.
     * @param node The node to register.
     */
    register(node: INodeType) {
        this.nodes[node.name] = node;
    }

    /**
     * Retrieves a node from the registry.
     * @param name The name of the node to retrieve.
     * @returns The node if found, otherwise undefined.
     */
    get(name: string): INodeType | undefined {
        return this.nodes[name];
    }
}
