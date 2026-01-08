//! # Instruction Handlers
//!
//! This module organizes all the logic for the escrow
//! program's instructions.
//!
//! ## Handler Modules
//!
//! - `create_offer` - Handles offer creation
//! - `accept_offer` - Handles offer completion
//! - `refund_offer` - Handles offer cancellation
//! - `shared_utils` - Common utility functions

pub mod accept_offer;
pub mod create_offer;
pub mod refund_offer;
pub mod shared_utils;
