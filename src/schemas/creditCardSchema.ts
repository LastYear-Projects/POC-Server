import { z } from "zod";

const creditCardSchema = z.object({
  cardName: z.string().min(2, "Valid name is required"),
  pointToMoney: z
    .number()
    .min(0, "Negative point to money conversion is not allowed"),
});

export default creditCardSchema;
