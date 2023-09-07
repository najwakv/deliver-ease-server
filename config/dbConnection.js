import mongoose from "mongoose"

const connection = () => {
    try {
        mongoose
        .connect(process.env.MONGODB)
        .then(() => console.log('connected to database'))
    } catch (error) {
        console.log(`error connecting to database : ${error}`)
    }
};

mongoose.set("strictQuery", true);

export default connection;