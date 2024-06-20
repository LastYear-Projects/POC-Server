import { Router } from "express";
import businessController from "../controllers/business.controller";
import { validateRequest } from "../middlewares";
import creditCardSchema from "../Schemas/creditCardSchema";
const businessRouter:Router = Router();


businessRouter
.get("/", businessController.getAllBusinesses)
.get("/find",businessController.getBusinessByParameters)
.get("/:id",businessController.getBusinessById)
.post("/",validateRequest(creditCardSchema), businessController.addBusiness)
.delete("/", businessController.deleteAllBusinesses)
.delete("/:id",businessController.deleteBussinessById)
export default businessRouter