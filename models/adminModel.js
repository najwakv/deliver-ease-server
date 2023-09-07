import mongoose from "mongoose";
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

const adminModel = mongoose.model("Admin", adminSchema);
export default adminModel;