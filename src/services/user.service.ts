import User, { IUser } from "../models/User.Model";
import genericService, { BaseService } from "./generic.service";
import { Types } from "mongoose";
import {generateToken} from "../common/index"
// Define the interface for the extended service
interface UserService extends BaseService {
  addCreditCard: (userID: Types.ObjectId, cardID: Types.ObjectId) => Promise<void>;
  getUserByEmail: (email:string) => Promise<IUser & {_id: Types.ObjectId}>;
  loginUser: (email: string, password: string) => Promise<string>
}

// Extend the base service with additional methods
const userService: UserService = {
  ...genericService<UserService>(User),

  addCreditCard: async (userID: Types.ObjectId, cardID: Types.ObjectId) => {
    const user = await User.findById(userID);
    if (!user) throw new Error("User not found");
    user.creditCards.push(cardID);

    await User.findOneAndUpdate({ _id: userID }, user);
  },

  getUserByEmail: async (email:string) => {
    return await User.findOne({email: email})

  },

  loginUser: async (email: string, password: string) => {
    let user = await userService.getUserByEmail(email)
    if (!user || user.password != password) throw new Error("Incorrect email or password");
    return generateToken({userId: user._id});
  }
};

export default userService;
