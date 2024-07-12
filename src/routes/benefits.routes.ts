import { Router } from "express";
import benefitController from "../controllers/benefit.controller";
import { validateRequest } from "../middlewares";
import benefitSchema from "../schemas/benefitSchema";

const benefitRouter: Router = Router();

benefitRouter
    .get("/", benefitController.getAllBenefits)
    .get("/:id", benefitController.getBenefitById)
    .post("/", validateRequest(benefitSchema), benefitController.addBenefit)
    .delete("/", benefitController.deleteAllBenefits)
    .delete("/:id", benefitController.deleteBenefitById);

export default benefitRouter;
