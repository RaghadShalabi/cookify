import { Router } from "express";
import * as favoriteController from "./controller/favorite.controller.js";
import { endPoint } from "./favorite.endpoint.js";
import { auth } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./favorite.validation.js"
const router = Router();

router.post("/", auth(endPoint.add), validation(validators.addRecipeToFavorites), asyncHandler(favoriteController.addRecipeToFavorites));
router.get("/", auth(endPoint.getAll), asyncHandler(favoriteController.getAllFavoriteRecipesForUser));
router.patch("/removeRecipe", auth(endPoint.delete), asyncHandler(favoriteController.removeRecipeFromFavorites));
router.patch("/clear", auth(endPoint.clear), asyncHandler(favoriteController.clearFavoriteList));

export default router;