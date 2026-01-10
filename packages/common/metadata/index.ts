import type { SUPPORTED_ASSETS } from "../supported-components";

// Properties attached to a Price Trigger node
export type PriceTriggerMetadata = {
  // SOL, BTC, ETH, etc
  asset: (typeof SUPPORTED_ASSETS)[number];

  // Price of the asset
  price: number;
};

// Properties attached to the action nodes
export type ActionNodeMetadata = {
  type: "LONG" | "SHORT";
  qty: number;
  asset: (typeof SUPPORTED_ASSETS)[number];
};

// Properties attached to a Time trigger node
export type TimerTriggerMetadata = {
  // Seconds until this triggers acts
  time: number;
};

// Properties attached to a Asset Transfer node
export type AssetTransferMetadata = {
  // SOL, BTC, ETH, etc
  asset: (typeof SUPPORTED_ASSETS)[number];

  // Amount of asset to transfer
  amount_to_transfer: number;

  receiver_address: string;
};
