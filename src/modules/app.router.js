import connectDB from "../../DB/connection.js";
import authRouter from "./auth/auth.router.js";
import userRouter from "./user/user.router.js";
import recipeRouter from "./recipe/recipe.router.js";
import commentRouter from "./comment/comment.router.js";
import ratingRouter from "./rating/rating.router.js";
import favoriteRouter from "./favorite/favorite.router.js"
import categoryRouter from "./category/category.router.js"
import { globalErrorHandler } from "../middleware/errorHandling.js";
import cors from "cors";

const initApp = (app, express) => {
  app.use(cors());
  app.use(express.json());
  connectDB();
  app.get("/", (req, res) => {
    return res.status(200).json("Welcome...");
  });
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/recipe", recipeRouter);
  app.use("/comment", commentRouter);
  // app.use("/rating", ratingRouter);
  app.use("/favorite",favoriteRouter)
  app.use("/category",categoryRouter)

  app.get("*", (req, res) => {
    return res.status(404).json({ message: "Page not found" });
  });
  app.use(globalErrorHandler);
};

export default initApp;
