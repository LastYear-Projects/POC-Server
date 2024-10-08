import { Router } from "express";
import creditCardController from "../controllers/creditCard.controller";
import { validateRequest } from "../middlewares";
import creditCardSchema from "../schemas/creditCardSchema";
const creditCardRouter: Router = Router();

creditCardRouter
    .get("/", creditCardController.getAllCreditCards)
    .get("/:id", creditCardController.getCreditCardById)
    .post("/", validateRequest(creditCardSchema), creditCardController.addCreditCard)
    //TODO:: add update route
    .delete("/", creditCardController.deleteAllCreditCards)
    .delete("/:id", creditCardController.deleteCreditCardById);
export default creditCardRouter;
