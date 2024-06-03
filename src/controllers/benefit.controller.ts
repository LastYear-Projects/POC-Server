import { Request, Response } from "express";
import benefitService from "../services/benefit.service";
import { IBenefit } from "../models/Benefit.model";

const getAllBenefits = async (req: Request, res: Response) => {
    try{
        const benefits = await benefitService.getAll()
        return res.json(benefits)
    }
    catch(error){
        return res.status(500).json({"error in getAllBenefits": error.message})
    }
}

const addBenefit = async  (req: Request, res: Response) => {
    try{
        const benefit:IBenefit = req.body
        if(!benefit.creditCardId || !benefit.discountType || !benefit.value || !benefit.valueType){
            return res.status(400).json({"error in addBenefit": "please provide required values" })
        }
        await benefitService.add(benefit)
        return res.status(201).json({})
    }
    catch(error){
        return res.status(500).json({"error in addCreditCard": error.message})
    }
}

const deleteAllBenefits = async  (req: Request, res: Response) => {
    benefitService.deleteAll();
    return res.status(203).json({"message": "deleted all Benefits successfully"})
}


export default {
    getAllBenefits,
    addBenefit,
    deleteAllBenefits
}