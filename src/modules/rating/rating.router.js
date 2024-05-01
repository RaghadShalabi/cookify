import { Router } from "express";
const router = Router({ mergeParams: true });
import * as ratingController from "./controller/rating.controller.js";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./rating.endpoint.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./rating.validation.js";

router.post("/", auth(endPoint.create), validation(validators.rateRecipe), ratingController.rateRecipe);
router.get("/", ratingController.getAverageRating);

export default router;