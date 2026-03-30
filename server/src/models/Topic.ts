import { Schema, Document, model } from "mongoose";

export interface ITopic extends Document {
    name: string;
    description: string;
    isParent: boolean;
    parent: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const topicSchema = new Schema<ITopic>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isParent: {
        type: Boolean,
        default: false
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: "Topic"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default model<ITopic>("Topic", topicSchema);
