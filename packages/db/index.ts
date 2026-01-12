import mongoose, { Schema } from "mongoose";

// ============================================
// USER SCHEMA
// ============================================
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    walletAddress: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);
export const UserModel = mongoose.model("User", userSchema);

// ============================================
// EDGES SCHEMA
// ============================================
const edgesSchema = new Schema(
  {
    edgeId: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

// ============================================
// NODE PROPERTIES SCHEMA
// ============================================
const nodePropertiesSchema = new Schema(
  {
    nodeId: {
      type: String,
      required: true,
    },
    node: {
      type: mongoose.Types.ObjectId,
      ref: "Node",
      required: true,
    },
    metadata: Schema.Types.Mixed,
    position: {
      x: {
        type: Number,
        required: true,
      },
      y: {
        type: Number,
        required: true,
      },
    },
    credentials: Schema.Types.Mixed,
  },
  {
    _id: false,
  }
);

// ============================================
// WORKFLOW SCHEMA
// ============================================
const workflowSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
    },
    edges: [edgesSchema],
    nodeProperties: [nodePropertiesSchema],
  },
  {
    timestamps: true,
  }
);
export const WorkflowModel = mongoose.model("Workflow", workflowSchema);

// ============================================
// NODE PROPERTIES SCHEMA
// ============================================
const nodeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["ACTION", "TRIGGER"],
    required: true,
  },
});
export const NodeModel = mongoose.model("Node", nodeSchema);

// ============================================
// EXECUTION SCHEMA
// ============================================
const executionSchema = new Schema({
  workflowId: {
    type: mongoose.Types.ObjectId,
    ref: "Workflow",
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "FINISHED", "CANCELLED", "FAILED"],
    required: true,
  },
  depositTxSignature: {
    type: String,
    required: true,
  },
  executionTxSignature: String,
  escrow_pda: {
    type: String,
    required: true,
  },
  vault_pda: {
    type: String,
    required: true,
  },
  maker_pubkey: {
    type: String,
    required: true,
  },
  destination_pubkey: {
    type: String,
    required: true,
  },
  amount_lamports: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  StartTime: Date,
  endTime: Date,
});
export const ExecutionModel = mongoose.model("Execution", executionSchema);
