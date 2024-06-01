import { Request, Response } from "express";
import creditCardService from "../services/creditCard.service";
import { ICreditCard } from "../models/CreditCard.model";

const getAllCreditCards = async (req: Request, res: Response) => {
    try{
        const creditCards = await creditCardService.getAll();
        return res.json(creditCards)
    }
    catch(error){
        return res.status(500).json({"error in getAllCards": error.message})
    }
}

const addCreditCard = async  (req: Request, res: Response) => {
    try{
        const card:ICreditCard = req.body
        if(!card.cardName) return res.json({"error in addCreditCard": "please provide credit card name" })
        await creditCardService.add(card)
        return res.status(201).json({})
    }
    catch(error){
        return res.status(500).json({"error in addCreditCard": error.message})
    }
}

const deleteAllCreditCards = async  (req: Request, res: Response) => {
    creditCardService.deleteAll();
    return res.status(203).json({"message": "deleted all CreditCards successfully"})

}

export default {
    getAllCreditCards,
    addCreditCard,
    deleteAllCreditCards
}