import joi from 'joi';

export const addRecipeToFavorites = joi.object({
    recipeId: joi.string().required(),
    categoryId: joi.string().required(),
})