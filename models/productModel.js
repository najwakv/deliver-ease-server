import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
    },
    image: {
        type: String,
    }
});

const productModel = mongoose.model("Product", productSchema);
export default productModel;