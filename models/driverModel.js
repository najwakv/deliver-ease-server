import mongoose from "mongoose";
const Schema = mongoose.Schema;

const driverSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    license: {
        type: String,
        required: true,
    },
    block: {
        type: Boolean,
        default: false,
    },
});

const driverModel = mongoose.model("Driver", driverSchema);
export default driverModel;