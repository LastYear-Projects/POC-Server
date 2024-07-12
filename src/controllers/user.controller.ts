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

const addCreditCard = async (req: Request, res: Response) => {
    //   type IUserPayload = Omit<IUser, "password">;

    //   interface IJwtPayload extends JwtPayload {
    //     user: IUserPayload;
    //   }
    const cardID = new Types.ObjectId(req.body.cardID);
    const creditCard = await creditCardService.getById(cardID);
    //   const {user}:IJwtPayload = req.body.user; //TODO: when we sign a jwt token - we should include a user object.
    const userID = new Types.ObjectId(req.body.userID);
    if (!creditCard)
        return res.status(400).json({
            error: "error in addCreditCard, the given creditCard id was not found in the system",
        });
    await userService.addCreditCard(userID, cardID);
    res.send();
};

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
    loginUser,
};
