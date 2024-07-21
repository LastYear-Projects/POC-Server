import { Router } from "express";
import userController from "../controllers/user.controller";
import { validateRequest, validateUserToken } from "../middlewares";
import userSchema from "../schemas/userSchema";

const userRouter:Router = Router();


userRouter
.get("/", userController.getAllUsers)
.get("/:id", userController.getUserById)
.post("/",validateRequest(userSchema),userController.addUser)
.post("/creditCard",validateUserToken,userController.addCreditCard) //TODO: we should apply the validateUserToken middleware here
//.put("/:id", userController.updateUser)
.put("/userPreferences",validateUserToken,userController.updateUserPreferences)
.delete("/", userController.deleteAllUsers)
.delete("/:id",  userController.deleteUserById)

export default userRouter