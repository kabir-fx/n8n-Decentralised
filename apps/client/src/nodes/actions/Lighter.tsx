import { Handle, Position } from "@xyflow/react"
import type { ActionNodeMetadata } from "common/types"

// Component to render the Lighter node
export function Lighter({ data }: {
    data: {
        metadata: ActionNodeMetadata
    }
}) {
    return <div className="rounded-md border bg-card text-card-foreground shadow-sm w-[250px]">
        <div className="p-4 border-b">
            <h3 className="font-semibold leading-none tracking-tight">Lighter Trade</h3>
        </div>
        <div className="p-4 space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="text-muted-foreground">Asset</span>
                <span className="font-medium">{data.metadata.symbol}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">Operation</span>
                <span className="font-medium">{data.metadata.type}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">Quantity</span>
                <span className="font-medium">{data.metadata.qty}</span>
            </div>
            <Handle type="target" position={Position.Left} className="w-3 h-3 bg-primary" />
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-primary" />
        </div>
    </div>
}