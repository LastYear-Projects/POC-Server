import mongoose, { Document, Types } from "mongoose";


export interface BaseService {
  getAll: (queryParams: Object) => Promise<any>;
  getById: (id: Types.ObjectId) => Promise<any>;
  add: (item: Object) => Promise<Document>;
  deleteAll: () => Promise<any>;
  deleteById: (id: Types.ObjectId) => Promise<any>;
}


const genericService = <T extends BaseService>(Model: mongoose.Model<any>): T => {
  const getAll: BaseService['getAll'] = async (queryParams: Object) => {
    if (Model.modelName === "benefit") {
      const query = [
        { path: "businessId", select: " -_id -__v" },
        { path: "creditCardId", select: " -_id -__v" }
      ];
      return await Model.find(queryParams).populate(query).exec();
    }
    return await Model.find(queryParams);
  };

  const getById: BaseService['getById'] = async (id: Types.ObjectId) => {
    try {
      return await Model.findById(id);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const add: BaseService['add'] = async (item: Object) => {
    const newModel: Document = new Model(item);
    return await newModel.save();
  };

  const deleteAll: BaseService['deleteAll'] = async () => {
    return await Model.deleteMany({});
  };

  const deleteById: BaseService['deleteById'] = async (id: Types.ObjectId) => {
    try {
      return await Model.findByIdAndDelete(id);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const baseService: BaseService = {
    getAll,
    getById,
    add,
    deleteAll,
    deleteById,
  };

  return baseService as T;
};

export default genericService;

