import { Request, Response } from "express";
import benefitService from "../services/benefit.service";
import { IBenefit } from "../models/Benefit.model";
import {Types} from "mongoose"

const getAllBenefits = async (req: Request, res: Response) => {
    try{
        const benefits = await benefitService.getAll()
        return res.json(benefits)
    }
    catch(error){
        return res.status(500).json({"error in getAllBenefits": error.message})
    }
}
const getBenefitById = async (req: Request, res: Response) => {
   
    const id=req.params.id
    try{
    const benefit = await benefitService.getById(new Types.ObjectId(id))
    if(benefit) 
        return res.json(benefit)
} catch (error:any) {
    return res.status(500).json({error: "error in getBenefitById " + error.message})
}
}

const getBenfitByParamaters = async (req: Request, res: Response) => {
try{
    const benefit = await benefitService.getByParameters(req.query)
    if(benefit)
        return res.json(benefit)
} catch (error:any) {
    return res.status(500).json({error: "error in getBenfitByParamaters " + error.message})
}
}

const addBenefit = async  (req: Request, res: Response) => {
    try{
        const benefit:IBenefit = req.body
        await benefitService.add(benefit)
        return res.status(201).json({})
    }
    catch(error){
        return res.status(500).json({error: "error in addBenefit " + error.message})
    }
}

const deleteAllBenefits = async  (req: Request, res: Response) => {
    benefitService.deleteAll();
    return res.send()
}

const deleteBenefitById = async (req:Request,res:Response) => {
    try{
        const id=new Types.ObjectId(req.params.id)
        benefitService.deleteById(id)
        return res.send()
    } catch (error:any) {
        return res.status(500).json({error: "error in deleteBenefitById " + error.message})
    }
}


export default {
    getAllBenefits,
    getBenefitById,
    getBenfitByParamaters,
    addBenefit,
    deleteAllBenefits,
    deleteBenefitById
}