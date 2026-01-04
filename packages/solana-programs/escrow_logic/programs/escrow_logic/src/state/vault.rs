//! # Vault State
//!
//! The `VaultAccount` stores the assets of an escrowed offer.

use anchor_lang::prelude::*;

/// Represents the account storing the assets.
#[account]
#[derive(InitSpace)]
pub struct VaultAccount {}
