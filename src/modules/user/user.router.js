import { Router } from "express";
const router = Router();
import * as userController from "./controller/user.controller.js";
import { auth, roles } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/errorHandling.js";
import { endPoint } from "./user.endpoint.js";

router.get("/",auth(Object.values(roles)), asyncHandler(userController.getProfile));
router.get("/users", asyncHandler(userController.getAllUsers));
router.delete("/:id", auth(endPoint.delete), asyncHandler(userController.deleteUser));

export default router;
