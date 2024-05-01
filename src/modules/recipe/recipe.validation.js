import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const createRecipe = joi.object({
    title: joi.string().min(3).max(25).required(),
    description: joi.string().min(2).max(150000),
    file: generalFields.file,
    ingredients: joi.array().required(),
    instructions: joi.string().required(),
    categoryId: joi.string().required(),
})
