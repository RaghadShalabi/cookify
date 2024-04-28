import { Router } from "express";
import * as categoryController from "./controller/category.controller.js";
import { endPoint } from "./category.endpoint.js";
import { auth } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/errorHandling.js";
import fileUpload, { fileValidation } from "../../services/multer.js";
const router = Router();

router.post("/", auth(endPoint.create), fileUpload(fileValidation.image).single("image"), asyncHandler(categoryController.createCategory));
router.get("/", asyncHandler(categoryController.getAllCategories));
router.get("/:id", asyncHandler(categoryController.getSpecificCategory));
router.put("/:id", auth(endPoint.update), fileUpload(fileValidation.image).single("image"), asyncHandler(categoryController.updateCategory));
router.delete("/:categoryId", auth(endPoint.delete), asyncHandler(categoryController.deleteCategory));

export default router;