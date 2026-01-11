import { Handle, Position } from "@xyflow/react";
import type { AssetTransferMetadata } from "common/types";
import { useState } from "react";

// React component for a Price trigger node
export function TransferAsset({
  data,
}: {
  data: {
    metadata: AssetTransferMetadata;
  };
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="rounded-md border bg-card text-card-foreground shadow-sm w-[250px]">
      <div className="p-4 border-b">
        <h3 className="font-semibold leading-none tracking-tight">
          Asset Transfer
        </h3>
      </div>
      <div className="p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Asset</span>
          <span className="font-medium">{data.metadata.asset}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Amount</span>
          <span className="font-medium">
            {data.metadata.amount_to_transfer}
          </span>
        </div>
        <div className="flex justify-between relative">
          <span className="text-muted-foreground">Receiver's Address</span>
          <span
            className="font-medium cursor-pointer underline decoration-dotted"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {data.metadata.receiver_address.slice(0, 4)}x...
          </span>
          {showTooltip && (
            <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg border z-50 whitespace-nowrap">
              {data.metadata.receiver_address}
            </div>
          )}
        </div>
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-primary"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-primary"
        />
      </div>
    </div>
  );
}
