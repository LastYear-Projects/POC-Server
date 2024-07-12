import { z } from "zod";
import userSchema from "./userSchema";

const loginSchema = z.object({
    email: z.string().email("invalid email was inserted"),
    password: z.string().min(8, "password must be at least 8 characters"),
});

export default loginSchema;
