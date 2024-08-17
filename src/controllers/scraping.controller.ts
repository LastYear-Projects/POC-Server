import { Request, Response } from "express";
import {scrapeWebSiteHever} from "../scraping/index.js";
import createBenefitFromURL from "../services/addBenefitsFromHever";

 const addBenefitsFromScraping = async (req: Request, res: Response) => {
    try {
        await createBenefitFromURL( await scrapeWebSiteHever());
        return res.status(201).json({});
    } catch (error: any) {
        return res
            .status(500)
            .json({ error: "error in addBenefitsFromScraping " + error.message });
    }
};

export default {
    addBenefitsFromScraping,
};
