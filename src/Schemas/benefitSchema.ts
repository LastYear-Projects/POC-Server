import { z } from "zod";
import {discountType,valueType} from "./Types"
import objectIdSchema from "./objectIdSchema";

const benefitSchema = z.object({
    businessId:objectIdSchema.optional(),
    creditCardId:objectIdSchema.optional(),
    discountType:discountType,
    valueType:valueType,
    value:z.number()
})

export default benefitSchema