import mongoose from "mongoose";
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    block: {
        type: Boolean,
        default: false, 
    },
});

const categoryModel = mongoose.model("Category", categorySchema);
export default categoryModel;