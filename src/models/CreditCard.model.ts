import mongoose, { Document } from "mongoose";

export enum CardBrand {
    MASTER_CARD = "masterCard",
    VISA = "visa",
    AMERICAN_EXPRESS = "americanExpress",
}

export interface ICreditCard extends Document {
    cardName: String;
    pointValue: number;
    cardBrand: CardBrand;
}

const CreditCardSchema = new mongoose.Schema<ICreditCard>({
    cardName: {
        type: String,
        required:true
    },
    cardBrand: {
        type: String,
        enum: Object.values(CardBrand),
        required: true
    },
    pointValue: {
        type: Number
    }
})

const CreditCard = mongoose.model<ICreditCard>("creditCard", CreditCardSchema, "creditCards")
export default CreditCard;
