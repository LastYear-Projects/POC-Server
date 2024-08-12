import { Request, Response } from "express";
import businessService from "../services/business.service";
import { IBusiness } from "../models/Business.model";
import { Types } from "mongoose";

const getAllBusinesses = async (req: Request, res: Response) => {
  const query = req.query;
  try {
    const creditCards = await businessService.getAll(query);
    return res.json(creditCards);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "error in getAllBusinesses " + error.message });
  }
};

const getBusinessById = async (req: Request, res: Response) => {
  const id = new Types.ObjectId(req.params.id);
  try {
    const business = await businessService.getById(id);
    if (business) return res.json(business);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: "error in getBusinessById " + error.message });
  }
};

const addBusiness = async (req: Request, res: Response) => {
  try {
    const business: IBusiness = req.body;
    await businessService.add(business);
    return res.status(201).json({});
  } catch (error) {
    return res
      .status(500)
      .json({ error: "error in addBusiness " + error.message });
  }
};

const deleteAllBusinesses = async (req: Request, res: Response) => {
  businessService.deleteAll();
  return res.send();
};
const deleteBussinessById = async (req: Request, res: Response) => {
  const id = new Types.ObjectId(req.params.id);
  try {
    businessService.deleteById(id);
    return res.send();
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: "error in deleteBussinessById " + error.message });
  }
};

export default {
  getAllBusinesses,
  getBusinessById,
  addBusiness,
  deleteAllBusinesses,
  deleteBussinessById,
};
