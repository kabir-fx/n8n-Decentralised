import type { 
    IWorkflow, 
    INodeExecuteData, 
    IExecuteFunctions,
    IRunExecutionData, 
    IExecuteData,
    ITaskDataConnections
} from "workflow-core";
import type { NodeType } from "common/types";
import type { NodeRegistry } from "./NodeRegistry";

export class WorkflowExecute {
    constructor(
        private workflow: IWorkflow,
        private registry: NodeRegistry,
        private runExecutionData: IRunExecutionData
    ) {}

    /**
     * Processes the run execution data by executing nodes in the workflow
     * @returns The run execution data after processing
     */
    public async processRunExecutionData(): Promise<IRunExecutionData> {
        // Runs the loops until the stack is empty
        while (this.runExecutionData.executionData.nodeExecutionStack.length > 0) {

            // Pops the last item from the stack
            const executionItem = this.runExecutionData.executionData.nodeExecutionStack.pop();

            // If no execution item is found, break the loop
            if (!executionItem) break;

            // Destructures the execution item
            const { node, data } = executionItem;

            try {
                // Executes the node using helper function
                const result = await this.executeNode(node, data);

                // Records the execution result using helper function
                this.recordExecutionResult(node.data.kind || node.id, result);

                // Adds the next nodes to the stack using helper function
                this.addNextNodesToStack(node, result);
            } catch (error) {
                // Logs the error and throws it
                console.error(`Error executing node ${node.id}:`, error);
                throw error;                
            }
        }

        // Returns the run execution data
        return this.runExecutionData;
    }

    /**
     * Executes a node and returns the result
     * @param node The node to execute
     * @param inputData The input data for the node
     * @returns The result of the node execution
     */
    private async executeNode(node: NodeType, inputData: ITaskDataConnections): Promise<INodeExecuteData[][]> {
        // Gets the node type from the node registry
        const nodeType = this.registry.get(node.type);
        // If node type is not found, throws an error
        if (!nodeType) {
            throw new Error(`Node Type ${node.type} not found`);
        }

        console.log(`Executing node: ${node.data.kind}: ${node.id}`);

        // Creates the execute functions object
        const executeFunctions: IExecuteFunctions = {
            getInputData: () => inputData[0] || []
        };

        // Executes the node and returns the result
        return await nodeType.execute.call(executeFunctions);
    }

    /**
     * Adds the next nodes to the stack
     * @param currentNode The current node
     * @param outputs The output data from the current node
     */
    private addNextNodesToStack(currentNode: NodeType, outputs: INodeExecuteData[][]) {
        // Iterates over the outputs
        outputs.forEach((outputData, outputIndex) => {

            // If output data is empty, returns
            if (!outputData || outputData.length === 0) return;

            // Gets the next node ids from the workflow connections using a helper function 
            const nextNodeIds = this.findNextNodes(currentNode.id, outputIndex);

            // Iterates over all the next node ids
            nextNodeIds.forEach(nextNodeId => {

                // Gets the next immediate node from the workflow nodes
                const nextNode = this.workflow.nodes.find(n => n.id === nextNodeId);
                if (!nextNode) return;

                // Creates the next execute item
                const nextExecuteItem: IExecuteData = {
                    node: nextNode,
                    data: {0: outputData},
                    source: {
                        previousNode: currentNode.id,
                        previousNodeOutput: outputIndex
                    }
                };

                // Pushes the node into the stack
                this.runExecutionData.executionData.nodeExecutionStack.push(nextExecuteItem);
            });
        });
    }

    /**
     * Records the execution result of a node
     * @param nodeName The name of the node
     * @param result The result of the node execution
     */
    private recordExecutionResult(nodeName: string, result: INodeExecuteData[][]) {
        this.runExecutionData.resultData.lastNodeExecuted = nodeName;
        this.runExecutionData.resultData.runData[nodeName] = result;
    }

    // TODO
    private findNextNodes(sourceId: string, outputIndex: number): string[] {
        if (!this.workflow.connections[sourceId]) return [];
        return this.workflow.connections[sourceId] || [];
    }
}