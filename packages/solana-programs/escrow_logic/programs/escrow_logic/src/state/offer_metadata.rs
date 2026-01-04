//! # Offer State
//!
//! This module defines the core data structure for escrow offers.
//! The `Offer` account stores all the necessary information about
//! an escrowed offer.

use anchor_lang::prelude::*;

/// Represents an escrow offer for storing the assets.
#[account]
#[derive(InitSpace)]
pub struct OfferMetadata {
    /// Unique identifier for this offer.
    pub id: u64,

    /// The public key of the account who created this offer.
    pub maker: Pubkey,

    // TODO! - store the metadata about the cryptocurrency/asset being stored in the vault [SOL, ETH, BTC]
    
    /// The amount of asset being locked.
    pub amount: u64,

    /// The bump seed used in PDA derivation.
    pub bump: u8,
}
