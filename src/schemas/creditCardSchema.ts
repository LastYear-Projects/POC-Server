import { z } from "zod";


const creditCardSchema = z.object({
    cardName:z.string().min(2,"Valid name is required"),
    pointValue: z.number().optional(),
})

export default creditCardSchema