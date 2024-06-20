import mongoose from "mongoose";
export enum DiscountType {
    POINTS = "points",
    CASHBACK = "cashback", //User cannot choose cashback as an option, Its an added bonus to
    //the respective credit card.
    DISCOUNT = "discount",
}

export enum ValueType {
    PERCENTAGE = "percentage",
    NUMBER = "number",
}

export interface IBenefit {
    businessId?: mongoose.Schema.Types.ObjectId;
    creditCardId: mongoose.Schema.Types.ObjectId;
    discountType: DiscountType;
    valueType:ValueType ;
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

    discountType: {
        type: String,
        enum: Object.values(DiscountType),
        required: true
    },
    valueType: {
        type: String,
        enum: Object.values(ValueType),
        required: true
    },
    value: {
        type: Number,
        min: 1
    }
    
})

const Benefit = mongoose.model<IBenefit>("benefit", BenefitSchema, "benefits")
export default Benefit;