import mongoose, { Schema } from "mongoose"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});
export const UserModel = mongoose.model("User", userSchema);

const edgesSchema = new Schema({
    edgeId: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    target: {
        type: String,
        required: true
    }
}, {
    _id: false
})

const nodePropertiesSchema = new Schema({
    nodeId: {
        type: String,
        required: true
    },
    node: {
        type: mongoose.Types.ObjectId,
        ref: 'Node',
        required: true
    },
    metadata: Schema.Types.Mixed,
    position: {
        x: {
            type: Number,
            required: true
        },
        y: {
            type: Number,
            required: true
        },
    },
    credentials: Schema.Types.Mixed
}, {
    _id: false
});

const workflowSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    edges: [edgesSchema],
    nodeProperties: [nodePropertiesSchema]
})
export const WorkflowModel = mongoose.model("Workflow", workflowSchema);

const CredentialsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    required: {
        type: Boolean,
        required: true
    }
})

const nodeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["ACTION", "TRIGGER"],
        required: true
    },
    credentialsType: [CredentialsSchema]
})
export const NodeModel = mongoose.model("Node", nodeSchema);

const executionSchema = new Schema({
    workflowId: {
        type: mongoose.Types.ObjectId,
        ref: 'Workflow',
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "FINISHED"],
        required: true
    },
    startTime: {
        type: Date,
        default: Date.now,
        required: true
    },
    endTime: Date
})
export const ExecutionModel = mongoose.model("Execution", executionSchema);
