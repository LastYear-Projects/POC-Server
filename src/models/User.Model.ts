import mongoose, { Types } from "mongoose";

export enum UserPreference {
  POINTS = "points",
  LOWEST_PRICE = "lowestPrice",
  NOMINAL_PROFIT="nominalProfit"
}

export interface IUser {
  firstName: String;
  lastName: String;
  email: String;
  password: String;
  creditCards: Types.ObjectId[];
  userPrefrence: UserPreference;
}

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
  userPrefrence: {
    type:String,
    enum:Object.values(UserPreference),
    default:UserPreference.NOMINAL_PROFIT
  },
});

const User = mongoose.model<IUser>("user", UserSchema, "users");
export default User;
