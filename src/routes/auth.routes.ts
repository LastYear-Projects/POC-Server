import { Router } from "express";
import userController from "../controllers/user.controller";
import userSchema from "../schemas/userSchema";
import { validateRequest } from "../middlewares";
import loginSchema from "../schemas/loginSchema";

const authRouter = Router();

authRouter
.post("/register", validateRequest(userSchema), userController.addUser)
.post("/login", validateRequest(loginSchema), userController.loginUser);

export default authRouter;
