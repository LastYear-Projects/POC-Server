import { z } from "zod";


const businessSchema = z.object({
    businessName:z.string().min(2,"Valid name is required"),
    businessCategory:z.string().optional(),
    businessImage:z.string().optional()
})

export default businessSchema