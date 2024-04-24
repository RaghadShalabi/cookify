import connectDB from "../../DB/connection.js";
import authRouter from "./auth/auth.router.js";
import userRouter from "./user/user.router.js";
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
  app.get("*", (req, res) => {
    return res.status(500).json({ message: "Page not found 404 x_x" });
  });
  app.use(globalErrorHandler);
};
export default initApp;
