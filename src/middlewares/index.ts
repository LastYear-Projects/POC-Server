import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import jwt from "jsonwebtoken";
import { DiscountType, IBenefit, ValueType } from "../models/Benefit.model";
const validateRequest =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const validationResult = schema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        errors: validationResult.error.errors.map((err) => ({
          path: err.path,
          message: err.message,
        })),
      });
    }

    next();
  };

const validateUserToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(400).json({ error: "no token provided" });
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err) => {
    if (err) {
      return res.status(400).json({ message: "Invalid token" });
    }
    next();
  });
};

const validateRecommendationRequest = (req: Request, res: Response, next: NextFunction) => {
  const { businessName, transactionAmount } = req.query;
  if (!businessName || !transactionAmount)
    return res.status(400).json({
      error: "error in validateRecommendationRequest, invalid parameters",
    });
  next();
};

const validateAddBenefit = (req: Request, res: Response, next: NextFunction) => {
  const benefit: IBenefit = req.body; 
  let value = benefit.value;
  let errorMessage;
  if(benefit.discountType == DiscountType.POINTS && !benefit.pointsValue) errorMessage="points must have a value";
  else if(benefit.valueType == ValueType.NUMBER && !benefit.minPurchaseAmount) errorMessage="a discount with NUMBER value type should include minimun purchase amount";
  else if(benefit.valueType == ValueType.PERCENTAGE && value > 100) errorMessage="a discount with PERCENTAGE value type should be less than 100";
  else if(benefit.valueType == ValueType.NUMBER) {
    if(benefit.discountType == DiscountType.POINTS) 
      value = value*benefit.pointsValue
    if(benefit.minPurchaseAmount && benefit.minPurchaseAmount < value) errorMessage="a discount must not be higher than the minimum purchase amount";
  }

  if(errorMessage) return res.status(400).json({error: "error in validateAddBenefit, " + errorMessage}) 

  next();

}


export { validateRequest, validateUserToken, validateRecommendationRequest, validateAddBenefit };
