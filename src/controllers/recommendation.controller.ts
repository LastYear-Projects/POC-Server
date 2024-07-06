import {Request, Response} from "express";
import userService from "../services/user.service";
import recommendationService from "../services/recommendation.service";
import benefitService from "../services/benefit.service";
import { Types } from "mongoose"
import jwt from "jsonwebtoken"
import { IBenefit } from "../models/Benefit.model";
import { IUser } from "../models/User.Model";

interface MyToken {
    exp:number,
    userId:string
}

const getRecommendations = async (req: Request, res: Response) => {
    const token=req.header["authorization"]
    const decodedToken=jwt.decode(token) as MyToken
    const userId=decodedToken.userId
    const id=new Types.ObjectId(userId)
    const {transactionAmount,businessName} = req.query
    try{
        const user:IUser= await userService.getById(id)
        if(!user) return res.status(400).json({error: "user not found"})
        const userCards=user.creditCards;
        const benefits: IBenefit[]= await benefitService.getAll({creditCardId:{$in:userCards},$or:[{businessName:businessName},{businessName:null}] })
        const filteredBenefits = benefits.filter(benefit=> benefit.minPurchaseAmount== undefined || benefit.minPurchaseAmount<Number(transactionAmount));
        const recommendations = await recommendationService.getRecommendations(filteredBenefits,user.userPreferences, Number(transactionAmount));
        return res.json(recommendations)
    } catch (error: any){
        return res.status(500).json({error: "error in getRecommendations " + error.message})
    }


}
export default {
    getRecommendations
}