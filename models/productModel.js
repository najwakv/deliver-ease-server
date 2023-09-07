import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema({

});

const productModel = mongoose.model("Products", productSchema);
export default productModel;