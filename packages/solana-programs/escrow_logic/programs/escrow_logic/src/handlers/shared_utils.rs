//! # Shared Utilities
//!
//! This module contains common utility functions used across multiple
//! instruction handlers.

use crate::error::ErrorCode;

use anchor_lang::{prelude::*, system_program};

/// Transfers asset between accounts.
///
/// For regular signer accounts, uses CPI to the System Program.
/// For PDA sources, directly modifies lamport balances.
///
/// # Arguments
///
/// * `source` - The account to transfer asset from
/// * `destination` - The account to transfer asset to
/// * `amount` - Amount of lamports to transfer
/// * `owning_pda_seeds` - Optional PDA seeds if source is a PDA
/// * `program` - The System Program
pub fn transfer_asset<'info>(
    source: &AccountInfo<'info>,
    destination: &AccountInfo<'info>,
    amount: u64,
    owning_pda_seeds: Option<&[&[u8]]>,
    program: &Program<'info, System>,
) -> Result<()> {
    match owning_pda_seeds {
        Some(_seeds) => {
            // For PDA transfers, directly modify lamport balances.
            **source.try_borrow_mut_lamports()? -= amount;
            **destination.try_borrow_mut_lamports()? += amount;

            Ok(())
        }
        None => {
            // For regular signer accounts, use System Program CPI
            let cpi_context = CpiContext::new(
                program.to_account_info(),
                system_program::Transfer {
                    from: source.to_account_info(),
                    to: destination.to_account_info(),
                },
            );

            system_program::transfer(cpi_context, amount)
                .map_err(|_| ErrorCode::InsufficientMakerBalance)?;

            Ok(())
        }
    }
}
