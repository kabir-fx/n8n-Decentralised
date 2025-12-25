// List of supported triggers currently available for use
export const SUPPORTED_ACTIONS = [
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


// List of supported assets currently available for use
export const SUPPORTED_ASSETS = ["SOL", "BTC", "ETH"]
