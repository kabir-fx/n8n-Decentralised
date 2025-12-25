import { Handle, Position } from "@xyflow/react"
import type { TimerTriggerMetadata } from "common/types"

// React component for a Time trigger node
export function Timer({ data }: {
    data: {
        metadata: TimerTriggerMetadata,
    }
}) {
    return <div className="rounded-md border bg-card text-card-foreground shadow-sm w-[250px]">
        <div className="p-4 border-b">
            <h3 className="font-semibold leading-none tracking-tight">Timer</h3>
        </div>
        <div className="p-4 space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="text-muted-foreground">Interval</span>
                <span className="font-medium">{data.metadata.time}s</span>
            </div>
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-primary" />
        </div>
    </div>
}
