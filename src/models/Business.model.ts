import mongoose from "mongoose";

export interface IBusiness {
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