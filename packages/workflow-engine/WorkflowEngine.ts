import type { NodeRegistry } from "./NodeRegistry";
import type { INodeExecuteData, IRunExecutionData, IWorkflow } from "workflow-core";
import { WorkflowExecute } from "./WorkflowExecute";

export class WorkflowEngine {
    constructor(private registry: NodeRegistry) {}

    async run(workflow: IWorkflow) {
        console.log(`Starting execution of workflow ${workflow.id}`);

        const startNode = workflow.nodes.find(n => n.data.kind === 'trigger') || workflow.nodes[0];

        if (!startNode) {
            console.error("No start node found");
            return;
        }

        const runExecutionData: IRunExecutionData = {
            resultData: { runData: {} },
            executionData: {
                context: {},
                waitingExecution: {},
                nodeExecutionStack: [{
                    node: startNode,
                    data: { 0: [] },
                    source: null
                }]
            }
        };

        const runner = new WorkflowExecute(workflow, this.registry, runExecutionData);

        await runner.processRunExecutionData();

        console.log("Execution Finished");
        
        // const triggerNode = workflow.nodes[0];
        
        // if (!triggerNode) return;

        // await this.executeNode(triggerNode, workflow, []);
    }

    private async executeNode(nodeData: any, workflow: IWorkflow, data: INodeExecuteData[]) {
        const nodeType = this.registry.get(nodeData.type);

        if (!nodeType) {
            throw new Error(`Node type ${nodeData.type} not found`);
        }

        console.log(`Executing node ${nodeData.name}`);
    }
}
