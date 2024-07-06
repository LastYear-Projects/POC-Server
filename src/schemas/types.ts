import { z } from "zod";
import objectIdSchema from "./objectIdSchema";

const discountType = z.enum(["points", "cashback", "discount"]);
const valueType = z.enum(["percentage", "number"]);
const userPreferences = z.object({
    profitType: z.enum(["points", "lowerPrice", "nominalValue"]),
    cardsPreference: z.array(objectIdSchema).optional(),
})


export  { discountType, valueType, userPreferences };
