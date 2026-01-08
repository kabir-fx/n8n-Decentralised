//! # Make Offer Handler
//!
//! This module implements the logic for creating new escrow offers.

use anchor_lang::prelude::*;

use crate::error::ErrorCode;
use crate::handlers::shared_utils::transfer_asset;
use crate::state::offer_metadata::OfferMetadata;
use crate::state::vault::VaultAccount;

/// Accounts required for creating an escrow offer.
///
/// This struct defines all the accounts needed to create a new offer.
#[derive(Accounts)]
pub struct MakeNewOffer<'info> {
    /// The Solana System Program (required for PDA creation and transfers).
    ///
    /// A Program type that wraps around System Program.
    pub system_program: Program<'info, System>,

    /// The account initializing the vault
    #[account(mut)]
    pub maker_account: Signer<'info>,

    /// PDA storing the metadata about this escrow offer
    #[account(
        init_if_needed,
        seeds = [b"offer", maker_account.key().as_ref()],
        bump,
        payer = maker_account,
        space = OfferMetadata::INIT_SPACE + OfferMetadata::DISCRIMINATOR.len(),
    )]
    pub offer_metadata_data_account: Account<'info, OfferMetadata>,

    /// Account [PDA] actually storing the SOL
    #[account(
        init_if_needed,
        seeds = [b"vault"],
        bump,
        payer = maker_account,
        space = VaultAccount::INIT_SPACE + VaultAccount::DISCRIMINATOR.len()
    )]
    pub vault: Account<'info, VaultAccount>,
}

/// Function to initialize the vault.   
///
/// # Arguments
///
/// * `ctx` - Provides non-argument inputs to the program
/// * `amount` - Amount to store in a vault
/// * `id` - Unique identifier for this offer.
pub fn initialize_vault(
    ctx: Context<MakeNewOffer>,
    escrow_amount: u64,
    target_price: u64,
    id: u64,
    destination_account: Pubkey,
) -> Result<()> {
    // Sanity check
    require!(escrow_amount > 0, ErrorCode::InvalidAmount);
    require!(target_price > 0, ErrorCode::InvalidAmount);

    transfer_asset(
        &ctx.accounts.maker_account,
        &ctx.accounts.vault.to_account_info(),
        escrow_amount,
        None,
        &ctx.accounts.system_program,
    )
    .map_err(|_| ErrorCode::InsufficientMakerBalance)?;

    // Store the metadata in the PDA
    ctx.accounts
        .offer_metadata_data_account
        .set_inner(OfferMetadata {
            id,
            maker: *ctx.accounts.maker_account.key,
            escrow_amount,
            bump: ctx.bumps.offer_metadata_data_account,
            target_price,
            destination_account,
        });

    Ok(())
}
