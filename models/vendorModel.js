import mongoose from "mongoose";
const Schema = mongoose.Schema;

const vendorSchema = new Schema({

})

const vendorModel = mongoose.model("Ventors", vendorSchema);
export default vendorModel;