mod error;
mod handlers;
mod state;

use anchor_lang::prelude::*;

use crate::handlers::accept_offer::*;
use crate::handlers::create_offer::*;
use crate::handlers::refund_offer::*;

declare_id!("3qxEyNRMxg4JNRhu8o8DymaBeHJf2QvQgiE52tLnJs4u");

#[program]
pub mod escrow_logic {
    use super::*;

    pub fn make_offer(
        ctx: Context<MakeNewOffer>,
        id: u64,
        amount_to_store: u64,
        target_price: u64,
        destination_account: Pubkey,
    ) -> Result<()> {
        initialize_vault(ctx, amount_to_store, target_price, id, destination_account)
    }

    pub fn refund_existing_offer(ctx: Context<RefundOffer>) -> Result<()> {
        refund_offer(ctx)
    }

    pub fn accept_an_offer(ctx: Context<TakeOffer>) -> Result<()> {
        take_offer(ctx)
    }
}
