import mongoose from "mongoose";
const Schema = mongoose.Schema;

const adminSchema = new Schema({

});

const adminModel = mongoose.model("Admin", adminSchema);
export default adminModel;