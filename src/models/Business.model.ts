import mongoose, { Document } from "mongoose";

export interface IBusiness extends Document {
    businessName: String,
    businessCategory?:String
    businessImage?:String // TODO: add default image 
}

const BusinessSchema = new mongoose.Schema<IBusiness>({
    businessName: {
        type: String,
        required: true
    },
    businessCategory :{
        type: String
    },
    businessImage :{
        type: String
    },
})

const Business = mongoose.model<IBusiness>("business", BusinessSchema, "businesses")
export default Business;