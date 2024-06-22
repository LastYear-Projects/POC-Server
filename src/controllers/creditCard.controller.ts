import { Request, Response } from "express";
import creditCardService from "../services/creditCard.service";
import { ICreditCard } from "../models/CreditCard.model";
import { Types } from "mongoose";

const getAllCreditCards = async (req: Request, res: Response) => {
  const query = req.query;
  try {
    
    const creditCards = await creditCardService.getAll(query);
    return res.json(creditCards);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: "error in getAllCreditCards " + error.message });
  }
};

const getCreditCardById = async (req: Request, res: Response) => {
  try {
    const id = new Types.ObjectId(req.params.id);
    const creditCard = await creditCardService.getById(id);
    if (creditCard) return res.json(creditCard);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: "error in getCreditCardById " + error.message });
  }
};

const addCreditCard = async (req: Request, res: Response) => {
  try {
    const card: ICreditCard = req.body;
    await creditCardService.add(card);
    return res.status(201).json({});
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: "error in addCreditCard " + error.message });
  }
};

const deleteAllCreditCards = async (req: Request, res: Response) => {
  creditCardService.deleteAll();
  return res.send();
};

const deleteCreditCardById = async (req: Request, res: Response) => {
  try {
    const id = new Types.ObjectId(req.params.id);
    creditCardService.deleteById(id);
    return res.send();
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: "error in deleteCreditCardById " + error.message });
  }
};

export default {
  getAllCreditCards,
  getCreditCardById,
  addCreditCard,
  deleteAllCreditCards,
  deleteCreditCardById,
};
