import { Handle, Position } from "@xyflow/react"
import type { PriceTriggerMetadata } from "common/types"

// React component for a Price trigger node
export function PriceTrigger({ data }: {
    data: {
        metadata: PriceTriggerMetadata,
    }
}) {
    return <div className="rounded-md border bg-card text-card-foreground shadow-sm w-[250px]">
        <div className="p-4 border-b">
            <h3 className="font-semibold leading-none tracking-tight">Price Trigger</h3>
        </div>
        <div className="p-4 space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="text-muted-foreground">Asset</span>
                <span className="font-medium">{data.metadata.asset}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">Price</span>
                <span className="font-medium">{data.metadata.price}</span>
            </div>
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-primary" />
        </div>
    </div>
}
