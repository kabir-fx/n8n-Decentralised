// List of supported triggers currently available for use
export const SUPPORTED_EXCHANGE = [
    {
        id: "hyperliquid",
        title: "Hyperliquid",
        description: "Place a trade on hyperliquid."
    },
    {
        id: "lighter",
        title: "Lighter",
        description: "Place a trade on lighter."
    },
    {
        id: "backpack",
        title: "Backpack",
        description: "Place a trade on backpack."
    }
]

// List of supported triggers currently available for use
export const SUPPORTED_TRIGGERS = [
    {
        id: "timer",
        title: "Timer",
        description: "Run this trigger every x min/sec."
    },
    {
        id: "price-trigger",
        title: "Price Trigger",
        description: "Run this trigger when the price of a stock crosses a certain threshold."
    }
]

export const SUPPORTED_NODES = [
    {
        id: "asset-transfer",
        title: "Asset Transfer",
        description: "Use this node to transfer an asset to a different account"
    },
    {
        id: "exchange-trade",
        title: "Place trade on exchange",
        description: "Use this node to place trade on an exchange"
    }
]

export const SUPPORTED_COMMUNICATION_CHANNELS = [
    {
        id: "discord",
        title: "Discord",
        description: "Communicate on Discord"
    },
    {
        id: "slack",
        title: "Slack",
        description: "Communicate on Slack"
    },
]

// List of supported assets currently available for use
export const SUPPORTED_ASSETS = ["SOL"]
