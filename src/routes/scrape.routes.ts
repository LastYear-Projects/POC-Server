import { Router } from "express";
import addBenefit from "../controllers/scraping.controller"


const scrapingRouter = Router();

scrapingRouter.get("/",addBenefit.addBenefitsFromScraping)

export default scrapingRouter;
