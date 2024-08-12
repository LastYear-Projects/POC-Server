import mongoose, { Document, Types } from "mongoose";

//
export enum ProfitType {
  POINTS = "points",
  LOWEST_PRICE = "lowestPrice",
  NOMINAL_PROFIT="nominalProfit"
}

export type UserPreferences = {
  profitType: ProfitType,
  cardsPreference?: Types.ObjectId[]
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  creditCards: Types.ObjectId[];
  userPreferences: UserPreferences
  _id?: Types.ObjectId
}


const UserPreferencesSchema = new mongoose.Schema<UserPreferences>({
  profitType: {
    type: String,
    enum: Object.values(ProfitType),
    default: ProfitType.NOMINAL_PROFIT,
  },
  cardsPreference: {
    type: [Types.ObjectId],
    default: [],
    ref: 'creditCard' // Assuming you have a CreditCard model
  }

}, { _id: false } )

const UserSchema = new mongoose.Schema<IUser>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  creditCards: {
    type: [Types.ObjectId],
    ref: "creditCard",
    default: [],
  },
  userPreferences: {
    type: UserPreferencesSchema,
    required: true,
    default: {
      profitType: ProfitType.NOMINAL_PROFIT,
      cardsPreference: []
    }
  }
});

const User = mongoose.model<IUser>("user", UserSchema, "users");
export default User;
