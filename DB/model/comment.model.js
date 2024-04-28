import mongoose, { Schema, Types, model } from "mongoose";

const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recipeId: {
            type: Types.ObjectId,
            ref: "Recipe",
            required: true,
        }, createdBy: {
            type: Types.ObjectId,
            ref: 'User',
        }
    },
    {
        timestamps: true,
    }
);

const commentMosel = model("Comment", commentSchema);

export default commentMosel;