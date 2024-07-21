import { Request, Response } from "express";
import userService from "../services/user.service";
import User, { IUser } from "../models/User.Model";
import { Types } from "mongoose";
import creditCardService from "../services/creditCard.service";
import jwt, { JwtPayload } from "jsonwebtoken";

const getAllUsers = async (req: Request, res: Response) => {
    const query = req.query;
    try {
        const users = await userService.getAll(query);
        return res.json(users);
    } catch (error: any) {
        return res.status(500).json({ error: "error in getAllUsers " + error.message });
    }
};

const getUserById = async (req: Request, res: Response) => {
    try {
        const id = new Types.ObjectId(req.params.id);
        const user = await userService.getById(id);
        return res.json(user);
    } catch (error: any) {
        return res.status(500).json({ error: "error in getUserById " + error.message });
    }
};
const addUser = async (req: Request, res: Response) => {
    try {
        const user: IUser = req.body;
        await userService.add(user);
        return res.status(201).json({});
    } catch (error: any) {
        return res.status(500).json({ error: "error in addUser " + error.message });
    }
};

const deleteAllUsers = async (req: Request, res: Response) => {
    await userService.deleteAll();
    return res.send();
};

const deleteUserById = async (req: Request, res: Response) => {
    try {
        const id = new Types.ObjectId(req.params.id);
        await userService.deleteById(id);
        return res.send();
    } catch (error: any) {
        return res.status(500).json({ error: "error in deleteUserById " + error.message });
    }
};

const addCreditCard = async (req: Request&{userId:Types.ObjectId}, res: Response) => { //TODO:: check if card already exists in the user cards
    //   type IUserPayload = Omit<IUser, "password">;

    //   interface IJwtPayload extends JwtPayload {
    //     user: IUserPayload;
    //   }
    const cardId = new Types.ObjectId(req.body.cardId);
    const creditCard = await creditCardService.getById(cardId);
    //   const {user}:IJwtPayload = req.body.user; //TODO: when we sign a jwt token - we should include a user object.
    const userId = req.userId;
    if (!creditCard)
        return res.status(400).json({
            error: "error in addCreditCard, the given creditCard id was not found in the system",
        });
    await userService.addCreditCard(userId, cardId);
    res.send();
};
// const updateUser = async (req: Request, res: Response) => {

// }
const updateUserPreferences = async (req: Request&{userId:Types.ObjectId}, res: Response) => {
//TODO :: add the user token validation middleware
    try {
        const userId = req.userId;
        const user = await userService.getById(userId);
        if (!user) {
            return res.status(400).json({ error: "error in updateUserPreferences, the given user id was not found in the system" });
        }
        console.log("body",req.body)
        await userService.updateUserPreferences(userId, req.body.userPreferences);
        res.send();
    } catch (error: any) {
        return res.status(500).json({ error: "error in updateUserPreferences " + error.message });
    }
}

const loginUser = async (req: Request, res: Response) => {
    try {
        const token = await userService.loginUser(req.body.email, req.body.password)
        res.json({token})
    } catch (e: any) {
        return res.status(400).json({ error: "error in loginUser: " + e.message });
    }
};

export default {
    getAllUsers,
    getUserById,
    addUser,
    deleteAllUsers,
    deleteUserById,
    addCreditCard,
   // updateUser,
    updateUserPreferences,
    loginUser,
};
