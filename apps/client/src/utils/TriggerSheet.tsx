import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet"
import type { NodeKind, NodeMetadata } from "common/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SUPPORTED_ASSETS, SUPPORTED_TRIGGERS, type PriceTriggerMetadata, type TimerTriggerMetadata } from "common/types";

// Component to render a sheet on the RHS of the webpage
export const TriggerSheet = ({
    onSelectHandler
}: {
    onSelectHandler: (
        kind: NodeKind,
        metadata: NodeMetadata
    ) => void
}) => {
    // State variables to handle the state of metadata of the node
    const [metadata, setMetadata] = useState<PriceTriggerMetadata | TimerTriggerMetadata>({
        time: 3600
    });
    const [selectedTrigger, setSelectedTrigger] = useState(SUPPORTED_TRIGGERS[0].id);

    return <Sheet open={true}>
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Select your trigger</SheetTitle>
                <SheetDescription>
                    <Select
                        // value: This tells the dropdown: "Show the option that matches the variable selectedTrigger
                        value={selectedTrigger}
                        //  onValueChange: When the user clicks a different option, this updates the selectedTrigger variable to the new choice
                        onValueChange={(value) => setSelectedTrigger(value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a trigger" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {/* Maps thru the list of all the supported triggers to display to the user */}
                                {SUPPORTED_TRIGGERS.map(({ id, title, description }) => <>
                                    <SelectItem value={id}> {title} </SelectItem>
                                    <SelectLabel>{description}</SelectLabel>
                                </>)}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {selectedTrigger == "timer" && <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Interval (seconds)
                            </label>
                            <Input type="text" placeholder="3600" onChange={(e) => {
                                setMetadata((existingMetadata) => ({
                                    ...existingMetadata,
                                    time: Number(e.target.value)
                                }))
                            }} ></Input>
                        </div>
                    </div>
                    }

                    {selectedTrigger == "price-trigger" && <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Price
                            </label>
                            <Input type="text" placeholder="0.00" onChange={(e) => {
                                setMetadata((existingMetadata) => ({
                                    ...existingMetadata,
                                    price: Number(e.target.value)
                                }))
                            }} >
                            </Input>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Asset
                            </label>
                            <Select
                                // value: This tells the dropdown: "Show the option that matches the variable selectedTrigger
                                value={metadata.asset}
                                //  onValueChange: When the user clicks a different option, this updates the selectedTrigger variable to the new choice
                                onValueChange={(value) => setMetadata((existingMetadata) => ({
                                    ...existingMetadata,
                                    asset: value
                                }))}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select an asset" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {/* Maps thru the list of all the supported triggers to display to the user */}
                                        {SUPPORTED_ASSETS.map((id) => <>
                                            <SelectItem value={id}> {id} </SelectItem>
                                        </>)}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>}
                </SheetDescription>
            </SheetHeader>
            <SheetFooter>
                <Button onClick={() => {
                    onSelectHandler(
                        selectedTrigger,
                        metadata
                    )
                }} > Submit </Button>
            </SheetFooter>
        </SheetContent>
    </Sheet>
}
