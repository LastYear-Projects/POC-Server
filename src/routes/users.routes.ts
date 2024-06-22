import { Router } from "express";
import userController from "../controllers/user.controller";
import { validateRequest } from "../middlewares";
import userSchema from "../schemas/userSchema";

const userRouter:Router = Router();


userRouter
.get("/", userController.getAllUsers)
.get("/:id", userController.getUserById)
.post("/",validateRequest(userSchema),userController.addUser)
.delete("/", userController.deleteAllUsers)
.delete("/:id", userController.deleteUserById)

export default userRouter