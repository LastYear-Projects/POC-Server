import { Router } from "express";
import creditCardController from "../controllers/creditCard.controller";
const creditCardRouter:Router = Router();


creditCardRouter
.get("/", creditCardController.getAllCreditCards)
.post("/", creditCardController.addCreditCard)
.delete("/", creditCardController.deleteAllCreditCards)
export default creditCardRouter