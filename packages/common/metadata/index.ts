import type { SUPPORTED_ASSETS } from "../supported-components"

// Properties attached to a Price Trigger node
export type PriceTriggerMetadata = {
    // SOL, BTC, ETH, etc
    asset: string

    // Price of the asset
    price: number
}
// Properties attached to the action nodes
export type ActionNodeMetadata = {
    type: "LONG" | "SHORT",
    qty: number,
    symbol: typeof SUPPORTED_ASSETS
}

// Properties attached to a Time trigger node
export type TimerTriggerMetadata = {
    // Seconds until this triggers acts
    time: number
}

