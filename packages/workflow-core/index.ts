import type { NodeType } from "common/types";

/**
 * Interface representing the data passed between nodes during execution.
 * This is the standard unit of data that flows through the workflow.
 */
export interface INodeExecuteData {
    /**
     * The JSON data payload.
     * This contains the actual business data (e.g., price, symbol, volume) produced by a node.
     */
    json: Record<string, unknown>;
}

/**
 * Interface exposing context and utility methods available to a node during execution.
 * Nodes use this to interact with the workflow engine and access data from previous steps.
 */
export interface IExecuteFunctions {
    /**
     * Retrieves the input data passed to this node from the previous node(s) in the workflow.
     * @returns An array of INodeExecuteData objects containing the input JSON.
     */
    getInputData(): INodeExecuteData[];
}

/**
 * Interface defining the structure and behavior of a Node Type.
 * Every specific node implementation (e.g., Trigger, Action) must implement this interface.
 */
export interface INodeType {
    /**
     * The unique name/identifier of the node type
     */
    name: string,

    /**
     * The core logic of the node.
     * This function is called by the execution engine when the workflow runs.
     * 
     * @param this The execution context, providing access to helper methods like getInputData().
     * @returns A Promise resolving to the output data (INodeExecuteData) to be passed to the next node.
     */
    execute(this: IExecuteFunctions): Promise<INodeExecuteData[][]>;
}

/**
 * Interface representing the structure of a workflow.
 * This defines the graph of nodes and their connections as stored in the database.
 */
export interface IWorkflow {
   id: string;
   /**
    * The list of nodes in this workflow, containing their configuration and UI position.
    */
   nodes: NodeType[];
   /**
    * The connections map defining how data flows between nodes.
    * Key: Source Node Name -> Value: Target Node Connections
    */
   connections: Record<string, any>;
}

/**
 * Interface representing the data connections between nodes in a task.
 * This is used to pass data between nodes during execution.
 */
export interface ITaskDataConnections {
    [index: number]: INodeExecuteData[];
}

export interface IExecuteData {
    node: NodeType,
    data: ITaskDataConnections,
    source: {
        previousNode: string;
        previousNodeOutput: number;
    } | null;
}

export interface IRunExecutionData {
    resultData: {
        runData: Record<string, unknown>;
        lastNodeExecuted?: string;
    };
    
    executionData: {
        context: Record<string, unknown>;
        nodeExecutionStack: IExecuteData[];
        waitingExecution: Record<string, ITaskDataConnections>;
    }
}