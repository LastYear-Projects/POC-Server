import {Request, Response} from "express";
import userService from "../services/user.service";
import recommendationService, { EvaluatedCreditCard } from "../services/recommendation.service";
import benefitService from "../services/benefit.service";
import { Types } from "mongoose"
import jwt from "jsonwebtoken"
import { IBenefit } from "../models/Benefit.model";
import { IUser } from "../models/User.Model";
import { userPreferences } from "../schemas/types";


const getRecommendations = async (req: Request & {userId: Types.ObjectId}, res: Response) => {
    const userId = req.userId

    const {transactionAmount,businessId} = req.query
    try{
        const user:IUser= await userService.getById(userId)
        if(!user) return res.status(400).json({error: "user not found"})
        const userCards=user.creditCards;
        const benefits: IBenefit[]= await benefitService.getAll({creditCardId:{$in:userCards},$or:[{businessId:businessId},{businessId:undefined}]})

        const filteredBenefits = benefits.filter(benefit=> benefit.minPurchaseAmount== undefined || Number(transactionAmount)>=benefit.minPurchaseAmount);
        if(user.userPreferences.cardsPreference.length == 0) user.userPreferences.cardsPreference=userCards;
        const recommendations: EvaluatedCreditCard[] = await recommendationService.getRecommendations(filteredBenefits,user.userPreferences, Number(transactionAmount));
        const sortedRecommendations = [...recommendations].sort((rec1, rec2) => rec2.grade-rec1.grade);
        return res.json(sortedRecommendations)
    } catch (error: any){
        return res.status(500).json({error: "error in getRecommendations " + error.message})
    }


}
export default {
    getRecommendations
}