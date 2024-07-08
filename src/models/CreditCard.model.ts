import mongoose, { Document } from "mongoose";

export interface ICreditCard extends Document {
  cardName: String;
  pointValue: number;
}

const CreditCardSchema = new mongoose.Schema<ICreditCard>({
  cardName: {
    type: String,
    required: true,
  },
  pointValue: {
    type: Number,
  },
});

const CreditCard = mongoose.model<ICreditCard>(
  "creditCard",
  CreditCardSchema,
  "creditCards"
);
export default CreditCard;
