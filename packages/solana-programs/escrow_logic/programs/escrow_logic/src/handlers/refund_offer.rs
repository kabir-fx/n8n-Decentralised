//! # Refund Offer Handler
//!
//! This module implements the logic for refunding existing escrow offers.
//! Makers can refund their escrowed assets if their offer has not been accepted.

use anchor_lang::prelude::*;

use crate::error::ErrorCode;
use crate::handlers::shared_utils::transfer_asset;
use crate::state::offer_metadata::OfferMetadata;
use crate::state::vault::VaultAccount;

/// Accounts required for refunding an escrow offer.
///
/// This struct defines the accounts needed to refund an unaccepted offer.
/// Only the original maker can initiate a refund.
#[derive(Accounts)]
pub struct RefundOffer<'info> {
    /// The Solana System Program (required for PDA creation and transfers).
    ///
    /// A Program type that wraps around System Program.
    pub system_program: Program<'info, System>,

    /// The maker who created the offer
    #[account(mut)]
    pub maker_account: Signer<'info>,

    /// PDA storing the metadata about this escrow offer
    #[account(
        mut,
        close = maker_account,
        seeds = [b"offer", maker_account.key().as_ref()],
        bump
    )]
    pub offer_metadata_data_account: Account<'info, OfferMetadata>,

    /// Account [PDA] actually storing the SOL
    #[account(
        mut,
        close = maker_account,
        seeds = [b"vault"],
        bump
    )]
    pub vault: Account<'info, VaultAccount>,
}

/// Refunds an unaccepted escrow offer to the maker.
///
/// This function allows the original maker to reclaim their assets
/// from the escrow vault if the offer has not been accepted.
/// The vault and offer accounts are closed, returning rent to the maker.
///
/// # Arguments
///
/// * `ctx` - The instruction context containing all required accounts
pub fn refund_offer(ctx: Context<RefundOffer>) -> Result<()> {
    // Signer seeds for PDA signing
    let offer_account_seeds: &[&[u8]] =
        &[b"offer", &[ctx.accounts.offer_metadata_data_account.bump]];
    let signer_seeds = Some(&offer_account_seeds[..]);

    transfer_asset(
        &ctx.accounts.vault.to_account_info(),
        &ctx.accounts.maker_account,
        ctx.accounts.offer_metadata_data_account.escrow_amount,
        signer_seeds,
        &ctx.accounts.system_program,
    )
    .map_err(|_| ErrorCode::FailedRefundTransfer)?;

    Ok(())
}
