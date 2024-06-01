import mongoose from "mongoose";

export interface ICreditCard {
    cardName: String;
}

const CreditCardSchema = new mongoose.Schema<ICreditCard>({
    cardName: {
        type: String,
        required:true
    }
})

const CreditCard = mongoose.model<ICreditCard>("creditCard", CreditCardSchema, "creditCards")
export default CreditCard;