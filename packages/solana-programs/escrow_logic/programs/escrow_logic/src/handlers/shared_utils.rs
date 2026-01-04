// //! # Shared Utilities
// //!
// //! This module contains common utility functions used across multiple
// //! instruction handlers. These functions encapsulate token operations
// //! and account management logic.

// use anchor_lang::prelude::*;

// /// Closes a token account and sends the rent to the specified destination account.
// ///
// /// This function closes an empty token account and recovers the rent lamports.
// /// If the token account is owned by a PDA, the `owning_pda_seeds` parameter
// /// must be provided to enable PDA signing.
// ///
// /// # Arguments
// ///
// /// * `token_account` - The token account to close
// /// * `destination` - Account to receive the recovered rent
// /// * `authority` - Account that has authority to close the token account
// /// * `token_program` - Token program interface
// /// * `owning_pda_seeds` - Optional PDA seeds if authority is a PDA
// ///
// /// # Requirements
// ///
// /// The token account must be empty (balance = 0) before it can be closed.
// pub fn close_token_account<'info>(
//     token_account: &InterfaceAccount<'info, TokenAccount>,
//     destination: &AccountInfo<'info>,
//     authority: &AccountInfo<'info>,
//     token_program: &Interface<'info, TokenInterface>,
//     owning_pda_seeds: Option<&[&[u8]]>,
// ) -> Result<()> {
//     // Set up close account instruction accounts
//     let close_accounts = CloseAccount {
//         account: token_account.to_account_info(),
//         destination: destination.to_account_info(),
//         authority: authority.to_account_info(),
//     };

//     // Prepare signer seeds for PDA signing (if needed)
//     let signers_seeds = owning_pda_seeds.map(|seeds| [seeds]);

//     // Execute close account via CPI, using PDA signer if required
//     close_account(if let Some(seeds_arr) = signers_seeds.as_ref() {
//         CpiContext::new_with_signer(token_program.to_account_info(), close_accounts, seeds_arr)
//     } else {
//         CpiContext::new(token_program.to_account_info(), close_accounts)
//     })
// }
