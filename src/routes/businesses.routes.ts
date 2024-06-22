import { Router } from "express";
import businessController from "../controllers/business.controller";
import { validateRequest } from "../middlewares";
import businessSchema from "../tmpdas/businessSchema";

const businessRouter:Router = Router();


businessRouter
.get("/", businessController.getAllBusinesses)
.get("/:id",businessController.getBusinessById)
.post("/",validateRequest(businessSchema), businessController.addBusiness)
.delete("/", businessController.deleteAllBusinesses)
.delete("/:id",businessController.deleteBussinessById)
export default businessRouter