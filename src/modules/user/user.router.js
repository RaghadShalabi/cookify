import { Router } from "express";
const router = Router();
import * as userController from "./controller/user.controller.js";
import { auth, roles } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/errorHandling.js";
import { endPoint } from "./user.endpoint.js";
import fileUpload, { fileValidation } from "../../services/multer.js";


export default router;
