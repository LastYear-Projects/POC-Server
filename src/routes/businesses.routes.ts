import { Router } from "express";
import businessController from "../controllers/business.controller";

const businessRouter:Router = Router();


businessRouter
.get("/", businessController.getAllBusinesses)
.get("/find",businessController.getBusinessByParameters)
.get("/:id",businessController.getBusinessById)
.post("/", businessController.addBusiness)
.delete("/", businessController.deleteAllBusinesses)
.delete("/:id",businessController.deleteBussinessById)
export default businessRouter