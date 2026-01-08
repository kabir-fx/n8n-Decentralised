//! # Error Codes
//!
//! This module defines all custom error codes used by the escrow program.
//! Each error provides a descriptive message explaining what went wrong
//! during program execution.
use anchor_lang::prelude::*;

/// Custom error codes for the escrow program.
#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient balance in maker's account")]
    InsufficientMakerBalance,

    #[msg("Incorrect destination account")]
    IncorrectDestinationAccount,

    #[msg("Amount must be greater than zero")]
    InvalidAmount,

    #[msg("Failed to transfer assets from vault")]
    FailedVaultTransfer,

    #[msg("Failed to refund assets from vault")]
    FailedRefundTransfer,
}
