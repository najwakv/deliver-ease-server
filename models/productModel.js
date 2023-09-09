import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Objectid = mongoose.Types.ObjectId;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: String,
        required: true,
    },
    category: {
        type: Objectid,
        ref: 'Category',
        required: true,
    },
    image: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    available: {
        type: Boolean,
        default: true,
    },
});

const productModel = mongoose.model("Product", productSchema);
export default productModel;