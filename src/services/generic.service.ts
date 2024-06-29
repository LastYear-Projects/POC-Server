import mongoose, { Document,Types } from "mongoose"

const service = (Model: mongoose.Model<any>) => {

    const getAll = async (queryParams:Object) => {
        if(Model.modelName == "benefit"){
            const query = [
                {path: "business", select: " -_id"}, //TODO: check if we need to change it to path: business
                {path: "creditCard"} //TODO: check if we need to change it to path: creditCard
            ]
            return await Model.find(queryParams).populate(query).exec();
        } 
        return await Model.find(queryParams)
    }

    const getById = async (id:Types.ObjectId) => {
        try {
            return await Model.findById(id)

        } catch (error) {
            throw new Error(error.message)
        }

    }

    const add = async (item:object) => {
        const newModel:Document = new Model(item);
        return await newModel.save()
    }

    const deleteAll = async () => {
        return await Model.deleteMany({})
    }
    
    const deleteById = async (id:Types.ObjectId) => {
        try {
            return await Model.findByIdAndDelete(id)
        } catch(error) {
            throw new Error(error.message)
        }
    }

    return {
        getAll,
        getById,
        add,
        deleteAll,
        deleteById,
    }

}

export default service;