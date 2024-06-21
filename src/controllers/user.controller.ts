import { Request, Response } from "express";
import userService from "../services/user.service"
import { IUser } from "../models/User.Model"
import { Types } from "mongoose";

const getAllUsers = async (req: Request, res: Response) => {
    const query=req.query
    try{
        const users = await userService.getAll(query);
        return res.json(users)
    }
    catch(error:any){
        return res.status(500).json({error: "error in getAllUsers " + error.message})
    }
}

const getUserById = async (req: Request, res: Response) => {
    try{
        const id=new Types.ObjectId(req.params.id)
        const user= await userService.getById(id)
        return res.json(user)
    } catch (error:any) {
        return res.status(500).json({error: "error in getUserById " + error.message})
    }
}
const addUser = async  (req: Request, res: Response) => {
    try{
        const user:IUser = req.body
        await userService.add(user)
        return res.status(201).json({})
    }
    catch(error:any){
        return res.status(500).json({error: "error in addUser " + error.message})
    }
}

const deleteAllUsers = async  (req: Request, res: Response) => {
    userService.deleteAll();
    return res.send()
}

const deleteUserById = async (req:Request,res:Response) => {
    try{
        const id=new Types.ObjectId(req.params.id)
        userService.deleteById(id)
        return res.send()
    } catch (error:any) {
        return res.status(500).json({error: "error in deleteUserById " + error.message})
    }
}

export default {
    getAllUsers,
    getUserById,
    addUser,
    deleteAllUsers,
    deleteUserById
}