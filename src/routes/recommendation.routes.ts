import { Router } from "express";
import recommendationController from "../controllers/recommendation.controller";
import { validateRequest, validateUserToken } from "../middlewares";
const recommendationRouter = Router();

// recommendationRouter
// .get("/", validateUserToken, recommendationController.getRecommendations)

recommendationRouter.post("/", recommendationController.getRecommendationsTest);

export default recommendationRouter;
