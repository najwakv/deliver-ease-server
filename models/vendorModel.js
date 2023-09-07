import mongoose from "mongoose";
const Schema = mongoose.Schema;

const vendorSchema = new Schema({
    name: {
        type: String,
        requied: true,
    },
    mobile: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
    },
    email: {
        type: String,
        requied: true,
        unique: true,
    },
    address: {
        type: String,
    },
})

const vendorModel = mongoose.model("Vendor", vendorSchema);
export default vendorModel;