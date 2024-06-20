import { Router } from "express";
import creditCardController from "../controllers/creditCard.controller";
import { validateRequest } from "../middlewares";
import creditCardSchema from "../Schemas/creditCardSchema";
const creditCardRouter:Router = Router();


creditCardRouter
.get("/", creditCardController.getAllCreditCards)
.get("/find",creditCardController.getCreditCardByParameters)
.get("/:id", creditCardController.getCreditCardById)
.post("/",validateRequest(creditCardSchema),creditCardController.addCreditCard)
.delete("/", creditCardController.deleteAllCreditCards)
.delete("/:id", creditCardController.deleteCreditCardById)
export default creditCardRouter