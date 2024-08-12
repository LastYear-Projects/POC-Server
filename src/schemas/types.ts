import { z } from "zod";
import objectIdSchema from "./objectIdSchema";
import { ProfitType } from "../models/User.Model";

const discountType = z.enum(["points", "cashback", "discount"]);
const valueType = z.enum(["percentage", "number"]);
const userPreferences = z.object({
    profitType: z.enum([ProfitType.POINTS, ProfitType.LOWEST_PRICE, ProfitType.NOMINAL_PROFIT]).optional(),
    cardsPreference: z.array(objectIdSchema).optional(),
});

export { discountType, valueType, userPreferences };
