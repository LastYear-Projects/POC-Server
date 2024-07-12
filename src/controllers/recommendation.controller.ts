import {Request, Response} from "express";
import userService from "../services/user.service";
import recommendationService from "../services/recommendation.service";
import benefitService from "../services/benefit.service";
import { Types } from "mongoose"
import jwt from "jsonwebtoken"
import { IBenefit } from "../models/Benefit.model";
import { IUser } from "../models/User.Model";


const getRecommendations = async (req: Request & {userId: Types.ObjectId}, res: Response) => {
    const userId = req.userId

    const {transactionAmount,businessId} = req.query
    try{
        const user:IUser= await userService.getById(userId)
        console.error(user)
        if(!user) return res.status(400).json({error: "user not found"})
        const userCards=user.creditCards;
        const benefits: IBenefit[]= await benefitService.getAll({creditCardId:{$in:userCards},$or:[{businessId:businessId},{businessId:undefined}]})
        const filteredBenefits = benefits.filter(benefit=> benefit.minPurchaseAmount== undefined || benefit.minPurchaseAmount<Number(transactionAmount));
        console.log("filteredBenefits: ", filteredBenefits)
        console.log("user.userPreferences: ", user.userPreferences)
        console.log("transactionAmount: ", Number(transactionAmount))
        const recommendations = await recommendationService.getRecommendations(filteredBenefits,user.userPreferences, Number(transactionAmount));
        return res.json(recommendations)
    } catch (error: any){
        return res.status(500).json({error: "error in getRecommendations " + error.message})
    }


}
export default {
    getRecommendations
}