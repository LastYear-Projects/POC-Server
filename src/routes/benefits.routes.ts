import { Router } from "express";
import benefitController from "../controllers/benefit.controller";


const benefitRouter:Router = Router();


benefitRouter
.get("/", benefitController.getAllBenefits)
.post("/", benefitController.addBenefit)
.delete("/", benefitController.deleteAllBenefits)

export default benefitRouter