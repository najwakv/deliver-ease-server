import mongoose from "mongoose";
const Schema = mongoose.Schema;

const driverSchema = new Schema({

});

const driverModel = mongoose.model("Driver", driverSchema);
export default driverModel;