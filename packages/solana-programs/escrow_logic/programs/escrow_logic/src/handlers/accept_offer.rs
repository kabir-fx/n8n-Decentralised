//! # Take Offer Handler
//!
//! This module implements the logic for executing an autonomous escrow transfer.
//! It allows a platform to trigger the transfer of escrowed funds to a
//! pre-defined destination once workflow conditions are met.

use super::shared_utils::transfer_asset;
use crate::{
    error::ErrorCode,
    state::{offer_metadata::OfferMetadata, vault::VaultAccount},
};
use anchor_lang::prelude::*;

/// Accounts required for executing an escrow transfer.
///
/// This struct defines the accounts needed to complete an autonomous transfer.
/// The platform signs and pays for the transaction, while funds are moved from
/// the program-owned vault to the user's specified destination.
#[derive(Accounts)]
pub struct TakeOffer<'info> {
    /// The Solana System Program (required for transfers and account closure).
    pub system_program: Program<'info, System>,

    /// The original offer maker (receives rent back when accounts are closed).
    #[account(mut)]
    pub maker: SystemAccount<'info>,

    /// The platform account (must sign to authorize and pay fees).
    #[account(mut)]
    pub platform_account: Signer<'info>,

    /// The destination account receiving the escrowed assets.
    /// CHECK: Validated against the `destination_account` stored in metadata.
    #[account(mut)]
    pub destination: SystemAccount<'info>,

    /// PDA storing the metadata about this autonomous workflow.
    /// Will be closed after execution, returning rent to the maker.
    #[account(
        mut,
        close = maker,
        seeds = [b"offer", maker.key().as_ref()],
        bump,
    )]
    pub offer_metadata_data_account: Account<'info, OfferMetadata>,

    /// The vault account storing the assets.
    /// Will be closed after execution, returning rent to the maker.
    #[account(
        mut,
        close = maker,
        seeds = [b"vault"],
        bump
    )]
    pub vault: Account<'info, VaultAccount>,
}

/// Executes the autonomous escrow transfer.
///
/// This function:
/// 1. Verifies that the provided destination matches the one saved at creation.
/// 2. Transfers the escrowed SOL from the vault PDA to the destination.
/// 3. Closes the metadata and vault accounts (returning rent to the maker).
///
/// # Arguments
///
/// * `ctx` - The instruction context containing all required accounts.
///
/// # Errors
///
/// * `IncorrectDestinationAccount` - If the destination doesn't match metadata.
/// * `FailedVaultTransfer` - If the SOL transfer fails.
pub fn take_offer(ctx: Context<TakeOffer>) -> Result<()> {
    require!(
        ctx.accounts.destination.key
            == &ctx.accounts.offer_metadata_data_account.destination_account,
        ErrorCode::IncorrectDestinationAccount
    );

    // Signer seeds for PDA signing
    let offer_account_seeds: &[&[u8]] =
        &[b"offer", &[ctx.accounts.offer_metadata_data_account.bump]];
    let signer_seeds = Some(&offer_account_seeds[..]);

    // Transfer escrowed tokens from vault to destination
    transfer_asset(
        &ctx.accounts.vault.to_account_info(),
        &ctx.accounts.destination.to_account_info(),
        ctx.accounts.offer_metadata_data_account.escrow_amount,
        signer_seeds,
        &ctx.accounts.system_program,
    )
    .map_err(|_| ErrorCode::FailedVaultTransfer)?;

    Ok(())
}
