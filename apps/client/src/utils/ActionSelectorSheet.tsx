import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { SUPPORTED_NODES } from "common/types";
import type { NodeKind, NodeMetadata } from "common/types";
import { AssetTransferSheet } from "./AssetTransferSheet";
import { ExchangeSheet } from "./ExchangeSheet";

type ActionType = (typeof SUPPORTED_NODES)[number]["id"] | null;

// Component to render a sheet on the RHS of the webpage for selecting action type
export const ActionSelectorSheet = ({
  onSelectHandler,
  onClose,
}: {
  onSelectHandler: (kind: NodeKind, metadata: NodeMetadata) => void;
  onClose: () => void;
}) => {
  // State to track selected action type (asset-transfer or exchange-trade)
  const [selectedActionType, setSelectedActionType] =
    useState<ActionType>(null);

  // If an action type is selected, show the corresponding sheet
  if (selectedActionType === "asset-transfer") {
    return (
      <AssetTransferSheet
        onSelectHandler={(kind, metadata) => {
          onSelectHandler(kind, metadata);
          setSelectedActionType(null);
        }}
        onClose={() => setSelectedActionType(null)}
      />
    );
  }

  if (selectedActionType === "exchange-trade") {
    return (
      <ExchangeSheet
        onSelectHandler={(kind, metadata) => {
          onSelectHandler(kind, metadata);
          setSelectedActionType(null);
        }}
        onClose={() => setSelectedActionType(null)}
      />
    );
  }

  // Otherwise, show the action type selector sheet
  return (
    <Sheet open={true} onOpenChange={(open) => !open && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Select Action Type</SheetTitle>
          <SheetDescription>
            <div className="space-y-3 pt-4">
              {SUPPORTED_NODES.map(({ id, title, description }) => (
                <div
                  key={id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-accent hover:border-primary transition-colors"
                  onClick={() => setSelectedActionType(id as ActionType)}
                >
                  <div className="font-medium">{title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {description}
                  </div>
                </div>
              ))}
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
