mod error;
mod state;

use anchor_lang::prelude::*;

declare_id!("NVzrbNACFEb8c2osL7L1LNEBjRXJNxGjrbJHtkVa8LL");

#[program]
pub mod escrow_logic {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
