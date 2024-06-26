import mongoose from "mongoose";

export interface ICreditCard {
  cardName: String;
  pointToMoney: number;
}

const CreditCardSchema = new mongoose.Schema<ICreditCard>({
  cardName: {
    type: String,
    required: true,
  },
  pointToMoney: {
    type: Number,
    default: 0,
  },
});

const CreditCard = mongoose.model<ICreditCard>(
  "creditCard",
  CreditCardSchema,
  "creditCards"
);
export default CreditCard;
