import slugify from "slugify";
import categoryModel from "../../../../DB/model/category.model.js";
import cloudinary from "../../../services/cloudinary.js";
import { pagination } from "../../../services/pagination.js";
import recipeModel from "../../../../DB/model/recipe.model.js";
import favoriteModel from "../../../../DB/model/favorite.model.js";

// Get all categories
export const getAllCategories = async (req, res, next) => {
    const { skip, limit } = pagination(req.query.page, req.query.limit);
    const categories = await categoryModel
        .find()
        .skip(skip)
        .limit(limit);
    return res.status(201).json({ message: "success", categories });
};

// Get specific category by id
export const getSpecificCategory = async (req, res, next) => {
    const { id } = req.params;
    const category = await categoryModel.findById(id);
    if (!category) {
        return next(new Error(`category not found`, { cause: 404 }));
    }
    return res.status(201).json({ message: "success", category });
};

// Create new category
export const createCategory = async (req, res, next) => {
    const name = req.body.name.toLowerCase();
    if (await categoryModel.findOne({ name })) {
        return next(new Error("Category name already exists", { cause: 409 }));
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.APP_NAME}/category`,
    });
    const category = await categoryModel.create({ name, slug: slugify(name), image: { secure_url, public_id }, createdBy: req.user._id, updatedBy: req.user._id, });
    return res.status(201).json({ message: "success", category });
};

// Update category
export const updateCategory = async (req, res, next) => {
    const { id } = req.params;
    const category = await categoryModel.findById(id);
    if (!category) {
        return next(new Error(`invalid category id ${req.params.id}`, { cause: 404 }));
    }
    if (await categoryModel.findOne({ name: req.body.name, _id: { $ne: category._id }, })) {
        return next(new Error(`category ${req.body.name} already exits`, { cause: 409 }));
    }
    category.name = req.body.name;
    category.slug = slugify(req.body.name);

    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.APP_NAME}/category`
        });
        await cloudinary.uploader.destroy(category.image.public_id);
        category.image = { secure_url, public_id };
    }
    category.updatedBy = req.user._id;
    await category.save();
    return res.status(201).json({ message: "success", category });
};

// Delete category
export const deleteCategory = async (req, res, next) => {
    const { categoryId } = req.params;
    const category = await categoryModel.findByIdAndDelete(categoryId);
    if (!category) {
        return next(new Error("category not found", { cause: 404 }));
    }
    await recipeModel.deleteMany({ categoryId });
    await favoriteModel.updateMany(
        { "recipes.categoryId": categoryId },
        { $pull: { recipes: { categoryId } } }
    ); return res.status(200).json({ message: "success", category });
};