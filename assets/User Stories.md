# Decentralised n8n-like workflow builder

## **Value Proposition:**

Our no-code platform harnesses Solana's speed and low fees to automate DAO governance with drag-and-drop workflows, enabling secure, verifiable decisions from proposals to treasury actions - empowering communities with transparency, efficiency, and reduced manual labor while preserving decentralisation.

## **Product-Market Fit:**

Solana DAO governance in 2025 remains manual and fragmented, with low voter turnout where members rely on disjointed apps (e.g., Realms for votes, Squads for treasuries), leading to "governance theater" and lost efficiency.  Our platform solves this by bundling atomic workflows (e.g., vote → escrow → swap) on-chain, fostering trust via PDAs and oracles.

Currently n8n has very minimal support for Blockchain - limited to community driven nodes, it can't natively sign transactions or interact directly with smart contracts, requiring middleware or custom JS code that exposes keys to risks.

Our platform embeds wallet adapters (e.g., Phantom) for seamless, secure signing in nodes like DAO voting or escrows (Squads vaults), eliminating middleware and enabling true on-chain governance without code hacks. 

## **Target User Profiles:**

- The “Proposer” Creator: This user initiates workflows for strategies like treasury swaps, valuing quick automations and verifiable outcomes. Frustrated by code-heavy tools, they seek no-code alternatives.

- The "Engaged" Member: This user participates in votes and monitors executions, wanting seamless notifications and transparency. They prioritize platforms that boost participation without spam or centralization.

## **User Story ID:** ADV-001

### **1. User Persona**

**Name:** Alice

**Role:** Proposer

**Goal:** Automate a treasury strategy with community approval for efficient, hands-off execution.

### **2. User Story:** As a proposer, I want to build and deploy an autonomous workflow for conditional treasury swaps so that the DAO can act on market triggers with verifiable consensus and minimal friction.

### **3. Acceptance Criteria**

**Functionality:**

- Platform allows the proposers to create a group for their DAO members .
- Platform allows the proposers to invite the DAO members to the aforementioned group.
- Platform allows proposers to drag-drop nodes for triggers (e.g., Pyth price), votes, and actions (e.g., Jupiter swap).
- Deploy to devnet/mainnet with one-click.

Workflow Attributes

- Nodes embed rules like thresholds (60% yes) and budgets ($410 USDC max).
- PDAs track vote tallies and execution logs for audits.

User Interactions

- Proposers configure via React canvas; members vote in-app with wallet sigs.
- Dashboard shows real-time tallies and simulations.

**Security:**

- Wallet-based verification gates access; PDAs prevent tampering.
- All transactions are bundled  for atomicity, ensuring revert on failure.

### **4. Priority:** High

## **User Story ID:** ADV-002

### **1. User Persona**

**Name:** Bob

**Role:** Engaged Member

**Goal:** Participate in proposals and monitor automated outcomes for transparent governance.

### **2. User Story: As an engaged member, I want to vote on workflows and receive verifiable updates so that I can contribute to DAO decisions with confidence and stay informed without manual checks.**

### **3. Acceptance Criteria**

**Functionality:**

- Members access proposals via dashboard; vote with single tx (PDA update + wallet permission).
- Threshold pass auto-deploys workflow; fails log rejection.
- Platform polls oracles for triggers (e.g., SOL >$200).

### **4. Priority:** High
