import mongoose, { Types, Schema, model } from "mongoose";

const ratingSchema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        recipeId: {
            type: Types.ObjectId,
            ref: "Recipe",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        createdBy: {
            type: Types.ObjectId,
            ref: 'User',
        }
    },
    {
        timestamps: true,
    }
);

const ratingModel = model("Rating", ratingSchema);

export default ratingModel;