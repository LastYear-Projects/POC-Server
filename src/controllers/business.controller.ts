import { Request, Response } from "express";
import businessService from "../services/business.service";
import { IBusiness } from "../models/Business.model";

const getAllBusinesses = async (req: Request, res: Response) => {
    try{
        const creditCards = await businessService.getAll();
        return res.json(creditCards)
    }
    catch(error){
        return res.status(500).json({"error in getAllBusinesses": error.message})
    }
}

const addBusiness = async  (req: Request, res: Response) => {
    try{
        const business:IBusiness = req.body
        if(!business.businessName) return res.json({"error in addBusiness": "please provide business name" })
        await businessService.add(business)
        return res.status(201).json({})
    }
    catch(error){
        return res.status(500).json({"error in addBusiness": error.message})
    }
}

const deleteAllBusinesses = async  (req: Request, res: Response) => {
    businessService.deleteAll();
    return res.status(203).json({"message": "deleted all businesses successfully"})

}

export default {
    getAllBusinesses,
    addBusiness,
    deleteAllBusinesses
}