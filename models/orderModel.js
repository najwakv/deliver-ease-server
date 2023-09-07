import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Objectid = mongoose.Types.ObjectId;

const orderSchema = new Schema({
    products: [
        {
            product: {
                type: Objectid,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    driver: {
        type: Objectid,
        ref: "Driver",
        required: true,
    },
    vendor: {
        type: Objectid,
        ref: 'Vendor',
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    collectedAmount: {
        type: Number,
        required: true,
    },
});

const orderModel = mongoose.model("Order", orderSchema);
export default orderModel;