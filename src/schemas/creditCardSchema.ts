import { z } from "zod";
import { CardBrand } from "../models/CreditCard.model";

const creditCardSchema = z.object({
    cardName: z.string().min(2, "Valid name is required"),
    pointValue: z.number().optional(),
    cardBrand: z.enum([CardBrand.VISA, CardBrand.MASTER_CARD, CardBrand.AMERICAN_EXPRESS]),
});

export default creditCardSchema;
