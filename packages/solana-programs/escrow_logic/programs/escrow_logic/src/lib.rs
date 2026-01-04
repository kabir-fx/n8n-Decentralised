mod error;
mod handlers;
mod state;

use anchor_lang::prelude::*;
pub use handlers::create_offer::*;

declare_id!("3qxEyNRMxg4JNRhu8o8DymaBeHJf2QvQgiE52tLnJs4u");

#[program]
pub mod escrow_logic {
    use super::*;

    pub fn make_offer(ctx: Context<MakeNewOffer>, requested_sol_amount: u64, id: u64) -> Result<()> {
        initialize_vault(ctx, requested_sol_amount, id)
    }
}
