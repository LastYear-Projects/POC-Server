import { Router } from "express";
import benefitController from "../controllers/benefit.controller";


const benefitRouter:Router = Router();


benefitRouter
.get("/", benefitController.getAllBenefits)
.get("/find", benefitController.getBenfitByParamaters)
.get("/:id", benefitController.getBenefitById)
.post("/", benefitController.addBenefit)
.delete("/", benefitController.deleteAllBenefits)
.delete("/:id", benefitController.deleteBenefitById)

export default benefitRouter