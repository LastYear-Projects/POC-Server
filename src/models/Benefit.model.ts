import mongoose from "mongoose";

enum ValueType {
    POINTS = "points",
    CASHBACK = "cashback", //User cannot choose cashback as an option, Its an added bonus to
    //the respective credit card.
    DISCOUNT = "discount",
}

enum DiscountType {
    PERCENTAGE = "percentage",
    NUMBER = "number",
}

export interface IBenefit {
    businessId?: mongoose.Schema.Types.ObjectId;
    creditCardId: mongoose.Schema.Types.ObjectId;
    valueType: ValueType.POINTS | ValueType.CASHBACK | ValueType.DISCOUNT;
    discountType: DiscountType.PERCENTAGE | DiscountType.NUMBER ;
    value: number;
}

const BenefitSchema = new mongoose.Schema<IBenefit>({
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "business"
    },
    creditCardId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "creditCard"
    },


})

const Benefit = mongoose.model<IBenefit>("benefit", BenefitSchema, "benefits")
export default Benefit;