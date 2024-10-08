import { z } from "zod";
import { discountType, valueType } from "./types";
import objectIdSchema from "./objectIdSchema";

const benefitSchema = z.object({
  businessId: objectIdSchema.optional(),
  creditCardId: objectIdSchema,
  discountType: discountType,
  valueType: valueType,
  value: z.number(),
  maxProfit: z.number().optional(),
  minPurchaseAmount: z.number().optional(),
});

export default benefitSchema;
