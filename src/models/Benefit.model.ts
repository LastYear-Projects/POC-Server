import mongoose from "mongoose";
import { Document, Types } from "mongoose";
import { ICreditCard } from "./CreditCard.model";
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

export interface IBenefit extends Document {
    businessId?: Types.ObjectId;
    creditCardId: Types.ObjectId;
    discountType: DiscountType;
    valueType:ValueType ;
    value: number;
    maxProfit?: number; //for a percentage benefit - describe the maximum profit a user can achieve. (may exists only in percentage)
    minPurchaseAmount?: number; // for a number benefit - describe the minimum purchase amount should be to activate the benefit. (exists only in number benefits)
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
    },
    maxProfit: {
        type: Number,
    },
    minPurchaseAmount: {
        type: Number
    }
    
})

const Benefit = mongoose.model<IBenefit>("benefit", BenefitSchema, "benefits")
export default Benefit;