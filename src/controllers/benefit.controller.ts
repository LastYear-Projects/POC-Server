import { Request, Response } from "express";
import benefitService from "../services/benefit.service";
import { DiscountType, IBenefit, ValueType } from "../models/Benefit.model";
import { Types } from "mongoose";

const getAllBenefits = async (req: Request, res: Response) => {
  const query = req.query;
  try {
    const benefits = await benefitService.getAll(query);
    return res.json(benefits);
  } catch (error) {
    return res.status(500).json({ "error in getAllBenefits": error.message });
  }
};
const getBenefitById = async (req: Request, res: Response) => {
  const id = new Types.ObjectId(req.params.id);
  try {
    const benefit = await benefitService.getById(id);
    if (benefit) return res.json(benefit);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: "error in getBenefitById " + error.message });
  }
};

const addBenefit = async (req: Request, res: Response) => {
  try {
    const benefit: IBenefit = req.body;
    await benefitService.add(benefit);
    return res.status(201).json({});
  } catch (error) {
    return res
      .status(500)
      .json({ error: "error in addBenefit " + error.message });
  }
};

const deleteAllBenefits = async (req: Request, res: Response) => {
  benefitService.deleteAll();
  return res.send();
};

const deleteBenefitById = async (req: Request, res: Response) => {
  try {
    const id = new Types.ObjectId(req.params.id);
    benefitService.deleteById(id);
    return res.send();
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: "error in deleteBenefitById " + error.message });
  }
};

export default {
  getAllBenefits,
  getBenefitById,
  addBenefit,
  deleteAllBenefits,
  deleteBenefitById,
};
