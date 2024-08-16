import { Router } from "express";
import addBenefit from "../controllers/scraping.contoller"


const scrapingRouter = Router();

scrapingRouter.get("/",addBenefit.addBenefitsFromScraping)

export default scrapingRouter;
