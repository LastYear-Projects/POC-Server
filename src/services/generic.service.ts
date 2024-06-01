import mongoose, { Document } from "mongoose"

const service = (Model: mongoose.Model<any>) => {
    const getAll = async () => {
        return await Model.find({})
    }

    const add = async (item) => {
        const newModel:Document = new Model(item);
        return await newModel.save()
    }

    const deleteAll = async()=> {
        return await Model.deleteMany({})
    }





    return {
        getAll,
        add,
        deleteAll
    }

    
}

export default service;