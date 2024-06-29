import mongoose, { Document } from "mongoose";

export interface IBusiness extends Document {
    businessName: String
}

const BusinessSchema = new mongoose.Schema<IBusiness>({
    businessName: {
        type: String,
        required: true
    }
})

const Business = mongoose.model<IBusiness>("business", BusinessSchema, "businesses")
export default Business;