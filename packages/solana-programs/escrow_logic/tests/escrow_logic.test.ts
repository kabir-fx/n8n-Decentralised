import {
  createTransaction,
  createSolanaClient,
  signTransactionMessageWithSigners,
  getSignatureFromTransaction,
  SolanaClusterMoniker,
  getExplorerLink,
  getProgramDerivedAddress,
  getAddressEncoder,
  address,
  Signature,
} from "gill";
import { loadKeypairSignerFromFile } from "gill/node";
import { getMakeOfferInstruction } from "../clients/js/src/generated/instructions/makeOffer.js";
import { ESCROW_LOGIC_PROGRAM_ADDRESS } from "../clients/js/src/generated/programs/escrowLogic.js";
import { describe, test } from "node:test";
import assert from "node:assert";
import { getRefundExistingOfferInstruction } from "../clients/js/src/generated/instructions/refundExistingOffer.js";
import { getAcceptAnOfferInstruction } from "../clients/js/src/generated/instructions/acceptAnOffer.js";

// ══════════════════════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════════════════════
const CLUSTER: SolanaClusterMoniker = "devnet";
const TEST_ESCROW_AMOUNT = 10_000_000n; // 0.01 SOL in lamports
const TEST_TARGET_PRICE = 200;
const TEST_OFFER_ID = 0;
const VERBOSE = "true";

describe("Escrow logic", async () => {
  // ══════════════════════════════════════════════════════
  // SETUP
  // ══════════════════════════════════════════════════════

  /**
   * Load keypair signers from the local filesystem
   */
  const signer = await loadKeypairSignerFromFile();
  const bob = address("2VSx7fBYQTegELEM5qch1QVvFSLtgUuJxCVV3J5hyQZz");
  const platform = await loadKeypairSignerFromFile(
    "~/.config/solana/platform.json"
  );

  if (VERBOSE) {
    console.log("Signer:", signer.address);
    console.log("Bob (destination):", bob);
    console.log("Platform:", platform.address);
  }

  /**
   * Create a client connection to the Solana blockchain
   */
  const { rpc, sendAndConfirmTransaction, simulateTransaction } =
    createSolanaClient({
      urlOrMoniker: CLUSTER,
    });

  /**
   * Derive PDAs using pre-defined seeds
   */
  const addressEncoder = getAddressEncoder();

  const [offerMetadataPda] = await getProgramDerivedAddress({
    programAddress: ESCROW_LOGIC_PROGRAM_ADDRESS,
    seeds: [Buffer.from("offer"), addressEncoder.encode(signer.address)],
  });

  const [vaultPda] = await getProgramDerivedAddress({
    programAddress: ESCROW_LOGIC_PROGRAM_ADDRESS,
    seeds: [Buffer.from("vault")],
  });

  if (VERBOSE) {
    console.log("Offer PDA:", offerMetadataPda);
    console.log("Vault PDA:", vaultPda);
  }

  // ══════════════════════════════════════════════════════
  // HELPER FUNCTIONS
  // ══════════════════════════════════════════════════════

  /**
   * Simulates and signs a transaction, returning the signature and signed transaction.
   */
  async function simulateAndSignTransaction(
    transaction: Parameters<typeof signTransactionMessageWithSigners>[0]
  ) {
    // Simulate the transaction
    const simulation = await simulateTransaction(transaction);
    if (VERBOSE) {
      console.log("Transaction simulation:", simulation);
    }

    // Sign the transaction with the provided `signer`
    const signedTransaction =
      await signTransactionMessageWithSigners(transaction);
      
    // Get the transaction signature after it has been signed by the `feePayer`
    const signature = getSignatureFromTransaction(signedTransaction);

    return { signature, signedTransaction };
  }

  /**
   * Logs the Solana Explorer link for a given transaction signature.
   */
  function logExplorerLink(signature: Signature) {
    console.log(
      "Explorer Link:",
      getExplorerLink({
        cluster: CLUSTER,
        transaction: signature,
      })
    );
  }

  /**
   * Creates and confirms a new offer on-chain.
   */
  async function createOffer(): Promise<Signature> {
    const makeOfferIx = getMakeOfferInstruction({
      makerAccount: signer,
      offerMetadataDataAccount: offerMetadataPda,
      vault: vaultPda,
      amountToStore: TEST_ESCROW_AMOUNT,
      targetPrice: TEST_TARGET_PRICE,
      destinationAccount: bob,
      id: TEST_OFFER_ID,
    });

    // Get the latest blockhash (aka transaction lifetime). This acts as a recent timestamp for the blockchain to key on when processing your transaction
    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

    // Create a transaction to be sent to the blockchain
    const transaction = createTransaction({
      version: "legacy",
      feePayer: signer,
      instructions: [makeOfferIx],
      latestBlockhash,
      computeUnitLimit: 25000,
    });

    // Call the helper functions
    const { signature, signedTransaction } =
      await simulateAndSignTransaction(transaction);
    logExplorerLink(signature);

    // Actually send the transaction to the blockchain and confirm it
    await sendAndConfirmTransaction(signedTransaction, {
      commitment: "confirmed",
      skipPreflight: true,
      maxRetries: 10n,
    });

    console.log("Offer created:", signature);
    return signature;
  }

  // ══════════════════════════════════════════════════════
  // TESTS
  // ══════════════════════════════════════════════════════

  test("should initialize a vault with the configured amount", async () => {
    await createOffer();

    // Assert that the metadata has been created
    const offerMetadataAccount = await rpc
      .getAccountInfo(offerMetadataPda)
      .send();
    assert.ok(
      offerMetadataAccount.value,
      "Offer metadata account should exist after transaction"
    );
    assert.equal(
      offerMetadataAccount.value?.owner,
      ESCROW_LOGIC_PROGRAM_ADDRESS,
      "Offer metadata should be owned by the escrow program"
    );

    // Assert that the vault has been created
    const vaultAccount = await rpc.getAccountInfo(vaultPda).send();
    assert.ok(
      vaultAccount.value,
      "Vault account should exist after transaction"
    );
    assert.equal(
      vaultAccount.value?.owner,
      ESCROW_LOGIC_PROGRAM_ADDRESS,
      "Vault should be owned by the escrow program"
    );
  });

  // Note: This test assumes an offer already exists from the previous test
  test("should accept the offer and close accounts", async () => {
    const acceptOfferIx = getAcceptAnOfferInstruction({
      maker: signer.address,
      platformAccount: platform,
      destination: bob,
      offerMetadataDataAccount: offerMetadataPda,
      vault: vaultPda,
    });

    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

    const transaction = createTransaction({
      version: "legacy",
      feePayer: platform,
      instructions: [acceptOfferIx],
      latestBlockhash,
      computeUnitLimit: 25000,
    });

    const { signature, signedTransaction } =
      await simulateAndSignTransaction(transaction);
    logExplorerLink(signature);

    await sendAndConfirmTransaction(signedTransaction, {
      commitment: "confirmed",
      skipPreflight: true,
      maxRetries: 10n,
    });

    console.log("Offer accepted:", signature);

    // Assert that the metadata account has been closed
    const offerMetadataAccount = await rpc
      .getAccountInfo(offerMetadataPda)
      .send();
    assert.ok(
      !offerMetadataAccount.value,
      "Offer metadata account should not exist after transaction"
    );

    // Assert that the vault has been closed
    const vaultAccount = await rpc.getAccountInfo(vaultPda).send();
    assert.ok(
      !vaultAccount.value,
      "Vault account should not exist after transaction"
    );
  });

  test("should refund the offer and close accounts", async () => {
    // Setup: Create a new offer first
    await createOffer();

    const refundOfferIx = getRefundExistingOfferInstruction({
      makerAccount: signer,
      offerMetadataDataAccount: offerMetadataPda,
      vault: vaultPda,
    });

    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

    const transaction = createTransaction({
      version: "legacy",
      feePayer: signer,
      instructions: [refundOfferIx],
      latestBlockhash,
      computeUnitLimit: 15000,
    });

    const { signature, signedTransaction } =
      await simulateAndSignTransaction(transaction);
    logExplorerLink(signature);

    await sendAndConfirmTransaction(signedTransaction, {
      commitment: "confirmed",
      skipPreflight: true,
      maxRetries: 10n,
    });

    console.log("Offer refunded:", signature);

    // Assert that the metadata account has been closed
    const offerMetadataAccount = await rpc
      .getAccountInfo(offerMetadataPda)
      .send();
    assert.ok(
      !offerMetadataAccount.value,
      "Offer metadata account should not exist after transaction"
    );

    // Assert that the vault has been closed
    const vaultAccount = await rpc.getAccountInfo(vaultPda).send();
    assert.ok(
      !vaultAccount.value,
      "Vault account should not exist after transaction"
    );
  });
});
