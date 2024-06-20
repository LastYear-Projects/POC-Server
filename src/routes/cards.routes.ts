import { Router } from "express";
import creditCardController from "../controllers/creditCard.controller";
const creditCardRouter:Router = Router();


creditCardRouter
.get("/", creditCardController.getAllCreditCards)
.get("/find",creditCardController.getCreditCardByParameters)
.get("/:id", creditCardController.getCreditCardById)
.post("/", creditCardController.addCreditCard)
.delete("/", creditCardController.deleteAllCreditCards)
.delete("/:id", creditCardController.deleteCreditCardById)
export default creditCardRouter