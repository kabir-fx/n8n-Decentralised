import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { NodeKind, NodeMetadata } from "common/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SUPPORTED_EXCHANGE,
  SUPPORTED_ASSETS,
  type ActionNodeMetadata,
} from "common/types";

// Component to render a sheet on the RHS of the webpage
export const ExchangeSheet = ({
  onSelectHandler,
  onClose,
}: {
  onSelectHandler: (kind: NodeKind, metadata: NodeMetadata) => void;
  onClose: () => void;
}) => {
  // State variables to handle the state of metadata of the node
  const [metadata, setMetadata] = useState<ActionNodeMetadata>({
    asset: "SOL",
    type: "LONG",
    qty: 2,
  });

  // State variable to handle the state of the selected action
  const [selectedAction, setSelectedAction] = useState(
    SUPPORTED_EXCHANGE[0].id
  );

  return (
    <Sheet open={true} onOpenChange={(open) => !open && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Select your action</SheetTitle>
          <SheetDescription>
            <Select
              value={selectedAction}
              onValueChange={(value) => setSelectedAction(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {/* Maps thru the list of all the supported actions to display to the user */}
                  {SUPPORTED_EXCHANGE.map(({ id, title, description }) => (
                    <>
                      <SelectItem value={id}> {title} </SelectItem>
                      <SelectLabel>{description}</SelectLabel>
                    </>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {(selectedAction == "backpack" ||
              selectedAction == "lighter" ||
              selectedAction == "hyperliquid") && (
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Type
                  </label>
                  <Select
                    value={metadata?.type}
                    onValueChange={(value) =>
                      setMetadata((existingMetadata) => ({
                        ...existingMetadata,
                        type: value as "LONG" | "SHORT",
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select operation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value={"LONG"}> Long </SelectItem>
                        <SelectItem value={"SHORT"}> Short </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Asset
                  </label>
                  <Select
                    value={metadata.asset}
                    onValueChange={(value) =>
                      setMetadata((existingMetadata) => ({
                        ...existingMetadata,
                        asset: value as (typeof SUPPORTED_ASSETS)[number],
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select asset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {/* Maps thru the list of all the supported assets to display to the user */}
                        {SUPPORTED_ASSETS.map((id) => (
                          <>
                            <SelectItem value={id}> {id} </SelectItem>
                          </>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Quantity
                  </label>
                  <Input
                    type="text"
                    placeholder="0.00"
                    onChange={(e) => {
                      setMetadata((existingMetadata) => ({
                        ...existingMetadata,
                        qty: Number(e.target.value),
                      }));
                    }}
                  ></Input>
                </div>
              </div>
            )}
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button
            onClick={() => {
              onSelectHandler(selectedAction as NodeKind, metadata);
            }}
          >
            Submit
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
