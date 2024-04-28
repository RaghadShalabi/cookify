import mongoose, { Types, Schema, model } from "mongoose";

const favoriteSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recipes: [{
            recipeId:
            {
                type: Types.ObjectId,
                ref: "Recipe",
                required: true
            },
            categoryId: {
                type: Types.ObjectId,
                ref: "Category",
            }
        }],
    },
    {
        timestamps: true,
    }
);

const favoriteModel = model("Favorite", favoriteSchema);

export default favoriteModel;