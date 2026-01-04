import {
  createTransaction,
  createSolanaClient,
  signTransactionMessageWithSigners,
  getSignatureFromTransaction,
  SolanaClusterMoniker,
  getExplorerLink,
  getProgramDerivedAddress,
  getAddressEncoder,
} from "gill";
import { loadKeypairSignerFromFile } from "gill/node";
import { getMakeOfferInstruction } from "../clients/js/src/generated/instructions/makeOffer.js";
import { ESCROW_LOGIC_PROGRAM_ADDRESS } from "../clients/js/src/generated/programs/escrowLogic.js";
import { describe, test, it } from "node:test";
import assert from "node:assert";

describe("Escrow logic", async () => {
  /**
   * Load a keypair signer from the local filesystem
   *
   * This defaults to the file path used by the Solana CLI: `~/.config/solana/id.json`
   */
  const signer = await loadKeypairSignerFromFile();

  /**
   * Declare what Solana network cluster we want our code to interact with
   */
  const cluster: SolanaClusterMoniker = "devnet";

  /**x
   * Create a client connection to the Solana blockchain
   *
   * Note: `urlOrMoniker` can be either a Solana network moniker or a full URL of a RPC provider
   */
  const { rpc, sendAndConfirmTransaction, simulateTransaction } =
    createSolanaClient({
      urlOrMoniker: cluster,
    });

  /**
   * Encode a base58-encoded address to a byte array
   */
  const addressEncoder = getAddressEncoder();

  /**
   * Derive both PDAs using pre-defined seeds
   */
  const [offerMetadataPda] = await getProgramDerivedAddress({
    programAddress: ESCROW_LOGIC_PROGRAM_ADDRESS,
    seeds: [Buffer.from("offer"), addressEncoder.encode(signer.address)],
  });
  console.log("Offer PDA:", offerMetadataPda);

  const [vaultPda] = await getProgramDerivedAddress({
    programAddress: ESCROW_LOGIC_PROGRAM_ADDRESS,
    seeds: [Buffer.from("vault")],
  });
  console.log("Vault PDA:", vaultPda);

  test("should initialize a vault with the configured amount", async () => {
    /**
     * Create a MakeOffer instruction to store SOL on-chain
     */
    const makeOfferIx = getMakeOfferInstruction({
      makerAccount: signer,
      offerMetadataDataAccount: offerMetadataPda,
      vault: vaultPda,
      requestedSolAmount: 10000000n,
      id: 0,
    });

    /**
     * Get the latest blockhash (aka transaction lifetime). This acts as a recent timestamp
     * for the blockchain to key on when processing your transaction
     *
     * Only request this value just before you are going to use it your code
     */
    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
    console.log("latestBlockhash:", latestBlockhash);

    /**
     * Create a transaction to be sent to the blockchain
     */
    const transaction = createTransaction({
      version: "legacy", // or `0` if using address lookup tables
      feePayer: signer,
      instructions: [makeOfferIx],
      latestBlockhash,
      // 12_000 ~ 17_000 CU utilized by Make Offer instruction + rough buffer
      computeUnitLimit: 25000,
      // TODO!: computeUnitPrice,
    });
    console.log("Transaction:");
    console.log(transaction);

    /**
     * Simulate the transaction
     */
    const simulation = await simulateTransaction(transaction);
    console.log("transaction simulation:");
    console.log(simulation);

    /**
     * Sign the transaction with the provided `signer`
     */
    const signedTransaction =
      await signTransactionMessageWithSigners(transaction);
    console.log("signedTransaction:");
    console.log(signedTransaction);

    /**
     * Get the transaction signature after it has been signed by the `feePayer`
     */
    const signature = getSignatureFromTransaction(signedTransaction);

    /**
     * Log the Solana Explorer link for the
     */
    console.log("Explorer Link:");
    console.log(
      getExplorerLink({
        cluster,
        transaction: signature,
      })
    );

    try {
      /**
       * Actually send the transaction to the blockchain and confirm it
       */
      await sendAndConfirmTransaction(signedTransaction, {
        commitment: "confirmed",
        skipPreflight: true,
        maxRetries: 10n,
      });

      console.log("Transaction confirmed!", signature);
    } catch (err) {
      console.error("Unable to send and confirm the transaction");
      console.error(err);
    }

    /**
     * Assert that the metadata has been created along with metadata
     */
    const offerMetadataAccount = await rpc
    .getAccountInfo(offerMetadataPda)
    .send();
    assert.ok(
      offerMetadataAccount.value,
      "Offer metadata account should exist after transaction"
    );
    assert.equal(offerMetadataAccount.value?.owner, ESCROW_LOGIC_PROGRAM_ADDRESS)

    /**
     * Assert that the vault has been created along with metadata
     */
    const vaultAccount = await rpc.getAccountInfo(vaultPda).send();
    assert.ok(
      vaultAccount.value,
      "Vault account should exist after transaction"
    );
    assert.equal(vaultAccount.value?.owner, ESCROW_LOGIC_PROGRAM_ADDRESS)
  });
});
