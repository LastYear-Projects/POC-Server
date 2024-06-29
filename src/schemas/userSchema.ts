import { z } from "zod";
import objectIdSchema from "./objectIdSchema";
import { ProfitType } from "../models/User.Model";

const nameRegex=/^[a-zA-Z]+$/

const userSchema = z.object({
    firstName:z.string().min(2,"Valid name is required").regex(nameRegex,"First name can only contain letters"),
    lastName:z.string().min(2,"Valid name is required").regex(nameRegex,"Last name can only contain letters"),
    email:z.string().email("invalid email was inserted"),
    password:z.string().min(8,"password must be at least 8 characters"),
    creditCards:z.array(objectIdSchema).optional(),
    userPreference:z.enum([ProfitType.POINTS,ProfitType.NOMINAL_PROFIT,ProfitType.LOWEST_PRICE]).optional()
})

export default userSchema