# Escrow Logic

## Description

The `escrow_logic` is a Solana smart program built with the Anchor framework. It is designed to handle the secure locking of funds in escrow vaults that are only released when specific verified conditions are met. 

This is a core component of the decentralized workflow builder, ensuring tamper-proof execution of value transfers.

## Instructions

The program exposes the following instructions:

### `make_offer`

Initializes a new offer and creates an associated vault to hold the funds.

- **Context**: `MakeNewOffer`
- **Arguments**:
  - `requested_sol_amount`: The amount of SOL required/involved in the offer.
  - `id`: A unique identifier for the offer.

### `refund_existing_offer`

Allows for the refunding of funds from an existing offer, effectively cancelling the escrow if conditions allow.

- **Context**: `RefundOffer`

### `accept_an_offer`

completes the transaction, transferring the funds/assets according to the offer terms.

- **Context**: `TakeOffer`

## Development

### Build

To build the program:

```bash
yarn run regenerate-client
```

### Test

To run the tests:

```bash
anchor test
```

### Deploy

To deploy to Devnet:

```bash
anchor deploy --provider.cluster devnet
```
