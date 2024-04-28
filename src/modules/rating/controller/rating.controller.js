import ratingModel from "../../../../DB/model/rating.model.js";
import recipeModel from "../../../../DB/model/recipe.model.js";

// Add or update rating for a recipe by user
export const rateRecipe = async (req, res, next) => {
    const { rating } = req.body;
    const { recipeId } = req.params;

    const recipe = await recipeModel.findOne({ _id: recipeId })
    if (!recipe) {
        return next(new Error("can not rating this recipe, recipe does not exist", { cause: 404 }))
    }
    let userRating = await ratingModel.findOne({ userId: req.user._id, recipeId: recipeId });

    if (userRating) {
        userRating.rating = rating;
    } else {
        userRating = await ratingModel.create({ createdBy: req.user._id, userId: req.user._id, recipeId: recipeId, rating });
    }
    const savedRating = await userRating.save();
    return res.status(201).json({ message: "success", savedRating });
};

// Get average rating for a recipe
export const getAverageRating = async (req, res, next) => {
    const { recipeId } = req.params;
    const ratings = await ratingModel.find({ recipeId: recipeId });

    if (ratings.length === 0) {
        return next(new Error("No ratings found for this recipe", { cause: 404 }));
    }
    let totalRating = 0;
    for (let i = 0; i < ratings.length; i++) {
        totalRating += ratings[i].rating;
    }
    const averageRating = totalRating / ratings.length;
    return res.status(200).json({ message: "success", averageRating });
};