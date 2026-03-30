import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
    fullName: string;
    username: string;
    email: string;
    password: string;
    mNumber?: string;
    avatar?: string;
    bio?: string;
    location?: string;
    role: "reader" | "author" | "editor" | "admin";
    status: "active" | "suspended" | "pending";
    isVerified: boolean;
    expertise?: string[];
    socials: {
        twitter?: string;
        linkedin?: string;
        website?: string;
    };
    bookmarks: Types.ObjectId[];
    followedTopics: Types.ObjectId[];
    settings: {
        newsletter: boolean;
        notifications: boolean;
        theme: "light" | "dark" | "system";
    };
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            minlength: 3,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
        },
        password: {
            type: String,
            required: true,
            select: false, // Don't return password by default
        },
        mNumber: {
            type: String,
            sparse: true,
        },
        avatar: {
            type: String,
            default: "https://ui-avatars.com/api/?name=User&background=random",
        },
        bio: {
            type: String,
            maxlength: 500,
        },
        location: {
            type: String,
        },
        role: {
            type: String,
            enum: ["reader", "author", "editor", "admin"],
            default: "reader",
        },
        status: {
            type: String,
            enum: ["active", "suspended", "pending"],
            default: "active",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        expertise: [
            {
                type: String,
            },
        ],
        socials: {
            twitter: String,
            linkedin: String,
            website: String,
        },
        bookmarks: [
            {
                type: Schema.Types.ObjectId,
                ref: "Article",
            },
        ],
        followedTopics: [
            {
                type: Schema.Types.ObjectId,
                ref: "Topic",
            },
        ],
        settings: {
            newsletter: {
                type: Boolean,
                default: true,
            },
            notifications: {
                type: Boolean,
                default: true,
            },
            theme: {
                type: String,
                enum: ["light", "dark", "system"],
                default: "system",
            },
        },
        lastLogin: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better search performance
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

export default model<IUser>("User", userSchema);