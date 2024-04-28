import { Router } from "express";
const router = Router({ mergeParams: true });
import * as ratingController from "./controller/rating.controller.js";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./rating.endpoint.js";

router.post("/", auth(endPoint.create), ratingController.rateRecipe);
router.get("/", ratingController.getAverageRating);

export default router;