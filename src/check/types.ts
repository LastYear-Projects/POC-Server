import { z } from "zod";

const discountType = z.enum(["points", "cashback", "discount"]);
const valueType = z.enum(["percentage", "number"]);

export  { discountType, valueType };
