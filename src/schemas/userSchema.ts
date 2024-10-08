import { z } from "zod";
import objectIdSchema from "./objectIdSchema";
import { userPreferences } from "./types";


const nameRegex=/^[a-zA-Z]+$/

const userSchema = z.object({
    firstName:z.string().min(2,"Valid name is required").regex(nameRegex,"First name can only contain letters").optional(),
    lastName:z.string().min(2,"Valid name is required").regex(nameRegex,"Last name can only contain letters").optional(),
    email:z.string().email("invalid email was inserted").optional(),
    password:z.string().min(8,"password must be at least 8 characters").optional(),
    creditCards:z.array(objectIdSchema).optional(),
    userPreferences: userPreferences.optional()
})

export default userSchema