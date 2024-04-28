import mongoose, { model, Schema, Types } from "mongoose";

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        slug: {
            type: String,
            required: true,
        },
        image: {
            type: Object,
        },
        createdBy: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        updatedBy: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const categoryModel = model("Category", categorySchema);

export default categoryModel;