import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = new Schema({

});

const orderModel = mongoose.model("Orders", orderSchema);
export default orderModel;