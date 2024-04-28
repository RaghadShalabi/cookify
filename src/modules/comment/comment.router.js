import { Router } from "express";
const router = Router({mergeParams:true});
import * as commentController from "./controller/comment.controller.js";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./comment.endpoint.js";
import { asyncHandler } from "../../middleware/errorHandling.js";

router.post("/", auth(endPoint.addComment), asyncHandler(commentController.addComment));
router.get("/", asyncHandler(commentController.getComments));
router.delete("/:commentId", auth(endPoint.delete), asyncHandler(commentController.deleteComment));

export default router;