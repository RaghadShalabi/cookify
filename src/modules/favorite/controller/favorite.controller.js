import favoriteModel from "../../../../DB/model/favorite.model.js";
import recipeModel from "../../../../DB/model/recipe.model.js";

// Get all favorite recipes for a user
export const getAllFavoriteRecipesForUser = async (req, res, next) => {
  const favoriteRecipes = await favoriteModel.findOne({ user: req.user._id }).populate("recipe");
  if (!favoriteRecipes) {
    return next(new Error("favorite list not found", { cause: 404 }));
  }
  return res.json(favoriteRecipes);
};

// Add recipe to favorites
export const addRecipeToFavorites = async (req, res, next) => {
  const { recipeId, categoryId } = req.body;
  const checkRecipe = await recipeModel.findOne({ _id: recipeId });
  if (!checkRecipe) {
    return next(new Error("Recipe not found", { cause: 404 }));
  }
  const favoriteList = await favoriteModel.findOne({ userId: req.user._id });

  if (!favoriteList) {
    const newFavoriteList = await favoriteModel.create({
      userId: req.user._id,
      recipes: { recipeId, categoryId },
    });
    return res.status(201).json({ message: 'success', newFavoriteList });
  }

  let matchedRecipe = false;
  for (let i = 0; i < favoriteList.recipes.length; i++) {
    if (favoriteList.recipes[i].recipeId == recipeId) {
      return next(new Error("Recipe already exists in favorite list", { cause: 403 }));
    }
  }

  if (!matchedRecipe) {
    favoriteList.recipes.push({ recipeId, categoryId });
  }
  await favoriteList.save();
  return res.status(200).json({ message: 'success', favoriteList });
};

// Remove recipe from favorites
export const removeRecipeFromFavorites = async (req, res, next) => {
  const { recipeId } = req.body;
  const userId = req.user._id;

  const recipeInFavorite = await favoriteModel.findOne({ "recipes.recipeId": recipeId })
  if (!recipeInFavorite) {
    return next(new Error("Recipe not found in favorites", { cause: 404 }));
  }
  const favoriteRecipe = await favoriteModel.updateOne({ userId },
    {
      $pull: {
        recipes: {
          recipeId,
        },
      },
    });
  return res.json({ message: "Recipe removed from favorites" });
};

// Remove all recipes from favorite list
export const clearFavoriteList = async (req, res, next) => {
  const clearFavoriteList = await favoriteModel.updateOne(
    { userId: req.user._id },
    { recipes: [] },
  );
  return res.status(201).json({ message: 'Your favorite list has been cleared.' });
}