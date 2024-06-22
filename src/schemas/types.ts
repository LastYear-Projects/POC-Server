import { z } from "zod";

const discountType = z.enum(["points", "cashback", "discount"]);
const valueType = z.enum(["percentage", "number"]);
const userPreference = z.enum(["lowestPrice", "nominalValue", "points"])

export  { discountType, valueType, userPreference };
