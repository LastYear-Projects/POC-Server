import { z } from "zod";


const businessSchema = z.object({
    businessName:z.string().min(2,"Valid name is required")
})

export default businessSchema