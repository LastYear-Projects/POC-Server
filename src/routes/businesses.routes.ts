import { Router } from "express";
import businessController from "../controllers/business.controller";

const businessRouter:Router = Router();


businessRouter
.get("/", businessController.getAllBusinesses)
.post("/", businessController.addBusiness)
.delete("/", businessController.deleteAllBusinesses)
export default businessRouter