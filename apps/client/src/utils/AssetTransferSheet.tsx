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
import type {
  AssetTransferMetadata,
  NodeKind,
  NodeMetadata,
} from "common/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SUPPORTED_ASSETS } from "common/types";

// Component to render a sheet on the RHS of the webpage
export const AssetTransferSheet = ({
  onSelectHandler,
}: {
  onSelectHandler: (kind: NodeKind, metadata: NodeMetadata) => void;
}) => {
  // State variables to handle the state of metadata of the node
  const [metadata, setMetadata] = useState<AssetTransferMetadata>({
    asset: "SOL",
    amount_to_transfer: 1,
    receiver_address: "xyz"
  });
//   const [selectedAction, setSelectedAction] = useState(
//     SUPPORTED_TRIGGERS[0].id
//   );

  return (
    <Sheet open={true}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Transfer Asset to another Account</SheetTitle>
          <SheetDescription>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Asset
                </label>
                <Select
                  // value: This tells the dropdown: "Show the option that matches the variable selectedTrigger
                  value={metadata.asset}
                  //  onValueChange: When the user clicks a different option, this updates the selectedTrigger variable to the new choice
                  onValueChange={(value) =>
                    setMetadata((existingMetadata) => ({
                      ...existingMetadata,
                      asset: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an asset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {/* Maps thru the list of all the supported triggers to display to the user */}
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
                  Amount
                </label>
                <Input
                  type="text"
                  placeholder="Amount to transfer"
                  onChange={(e) => {
                    setMetadata((existingMetadata) => ({
                      ...existingMetadata,
                      amount_to_transfer: Number(e.target.value),
                    }));
                  }}
                ></Input>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Receiver's Address
                </label>
                <Input
                  type="text"
                  placeholder="Account that will receive this amount"
                  onChange={(e) => {
                    setMetadata((existingMetadata) => ({
                      ...existingMetadata,
                      receiver_address: e.target.value,
                    }));
                  }}
                ></Input>
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button
            onClick={() => {
              onSelectHandler("asset-transfer", metadata);
            }}
          >
            {" "}
            Submit{" "}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
