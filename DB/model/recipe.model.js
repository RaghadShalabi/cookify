import mongoose, { Types, Schema, model } from "mongoose";

const recipeSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
        },
        ingredients: {
            type: [String],
            required: true,
        },
        instructions: {
            type: String,
            required: true,
        },
        image: {
            type: Object,
        },
        author: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        categoryId: {
            type: Types.ObjectId,
            ref: "Category",
            required: true,
        },
        createdBy: {
            type: Types.ObjectId,
            ref: "User",
        },
        updatedBy: {
            type: Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

recipeSchema.virtual("comment", {
    ref: "Comment",
    localField: "_id",
    foreignField: "recipeId",
});

recipeSchema.virtual("rating", {
    ref: "Rating",
    localField: "_id",
    foreignField: "recipeId",
});

const recipeModel = model("Recipe", recipeSchema);

export default recipeModel;