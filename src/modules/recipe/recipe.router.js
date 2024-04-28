import { Router } from "express";
const router = Router();
import * as recipeController from "./controller/recipe.controller.js";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./recipe.endpoint.js";
import fileUpload, { fileValidation } from "../../services/multer.js";
import { asyncHandler } from "../../middleware/errorHandling.js";
import ratingRouter from "../rating/rating.router.js"
import commentRouter from "../comment/comment.router.js"

router.use("/:recipeId/comment", commentRouter);
router.use("/:recipeId/rating", ratingRouter);
router.get("/", asyncHandler(recipeController.getAllRecipes));
router.get("/:id", asyncHandler(recipeController.getRecipeById));
router.post("/", auth(endPoint.create), fileUpload(fileValidation.image).single("image"), asyncHandler(recipeController.createRecipe));
router.delete("/:id", auth(endPoint.delete), asyncHandler(recipeController.deleteRecipe));
router.patch("/:id", auth(endPoint.update), fileUpload(fileValidation.image).single("image"), asyncHandler(recipeController.updateRecipe))

export default router;