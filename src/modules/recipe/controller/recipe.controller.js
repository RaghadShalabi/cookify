import slugify from "slugify";
import categoryModel from "../../../../DB/model/category.model.js";
import recipeModel from "../../../../DB/model/recipe.model.js";
import cloudinary from "../../../services/cloudinary.js";
import { pagination } from "../../../services/pagination.js";

// Get all recipes
export const getAllRecipes = async (req, res, next) => {
    const { skip, limit } = pagination(req.query.page, req.query.limit);
    const mongooseQuery = recipeModel
        .find({}).skip(skip).limit(limit);
    if (req.query.search) {
        mongooseQuery.find({
            $or: [
                { title: { $regex: req.query.search, $options: "i" } },
                { description: { $regex: req.query.search, $options: "i" } },
            ],
        });
    }
    mongooseQuery.select(req.query.fields?.replaceAll(",", " "));
    const recipes = await mongooseQuery.populate("comment").populate("rating");
    const total = await recipeModel.estimatedDocumentCount();
    return res.status(201).json({ message: "success", total, pageTotal: recipes.length, recipes });
};

// Get single recipe by id with comment & rating
export const getRecipeById = async (req, res, next) => {
    const recipe = await recipeModel.findById(req.params.id).populate("comment").populate("rating");
    if (!recipe) {
        return next(new Error('recipe not found', { cause: 404 }));
    }
    return res.json({ message: "success", recipe });
};

// Create new recipe
export const createRecipe = async (req, res, next) => {
    const { title, description, ingredients, instructions, categoryId } = req.body;

    const checkCategory = await categoryModel.findById(categoryId);
    if (!checkCategory) {
        return next(new Error("category not found", { cause: 404 }));
    }
    req.body.slug = slugify(title);
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.APP_NAME}/recipe/${req.body.title}/mainImage`,
    }
    );
    req.body.image = { secure_url, public_id };
    req.body.createdBy = req.user._id;
    req.body.updatedBy = req.user._id;
    req.body.author = req.user._id;
    const recipe = await recipeModel.create(req.body);
    return res.status(201).json({ message: "success", recipe });
};

// Delete recipe
export const deleteRecipe = async (req, res, next) => {
    const recipe = await recipeModel.findByIdAndDelete(req.params.id);

    if (!recipe) {
        return next(new Error("Recipe not found", { cause: 404 }));
    }
    if (recipe.author.toString() !== req.user._id.toString()) {
        return next(new Error("You are not authorized to delete this recipe", { cause: 403 }));
    }
    return res.status(201).json({ message: "Recipe deleted successfully" });
};

//Update recipe
export const updateRecipe = async (req, res, next) => {
    const { id } = req.params;
    const { title, description, ingredients, instructions, categoryId } = req.body;

    const recipe = await recipeModel.findById(id);

    if (!recipe) {
      return next(new Error("Recipe not found", { cause: 404 }));
    }

    if (req.user.role !== "Admin" && recipe.author.toString() !== req.user._id.toString()) {
      return next(new Error("You are not authorized to update this recipe", { cause: 403 }));
    }

    if (await recipeModel.findOne({ title: req.body.title, _id: { $ne: recipe._id }, })) {
        return next(new Error(`recipe ${req.body.title} already exits`, { cause: 409 }));
    }

    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.APP_NAME}/recipe`
        });
        await cloudinary.uploader.destroy(recipe.image.public_id);
        recipe.image = { secure_url, public_id };
    }
    if (title) recipe.title = title;
    if (description) recipe.description = description;
    if (ingredients) recipe.ingredients = ingredients;
    if (instructions) recipe.instructions = instructions;
    if (categoryId) recipe.categoryId = categoryId;
    recipe.slug = slugify(title || recipe.title);
    recipe.updatedBy = req.user._id;

    await recipe.save();
    return res.status(200).json({ message: "Recipe updated successfully", recipe });
}
