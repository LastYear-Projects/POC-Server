import { Router } from "express";
import recommendationController from "../controllers/recommendation.controller";
const recommendationRouter=Router();

recommendationRouter
.get("/",recommendationController.getRecommendations)





export default recommendationRouter