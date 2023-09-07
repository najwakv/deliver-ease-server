import mongoose from "mongoose";
const Schema = mongoose.Schema;

const driverSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
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
});

const driverModel = mongoose.model("Driver", driverSchema);
export default driverModel;