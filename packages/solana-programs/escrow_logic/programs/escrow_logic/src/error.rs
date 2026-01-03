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

    #[msg("Amount must be greater than zero")]
    InvalidAmount,

    #[msg("Failed to withdraw assets from vault")]
    FailedVaultWithdrawal,

    #[msg("Failed to close vault account")]
    FailedVaultClosure,

    #[msg("Failed to refund assets from vault")]
    FailedRefundTransfer,

    #[msg("Failed to close vault during refund")]
    FailedRefundClosure,
}
