import joi from 'joi';

export const rateRecipe = joi.object({
    recipeId:joi.string().required(),
    rating:joi.number().positive().integer().min(1).max(5).required(),
})