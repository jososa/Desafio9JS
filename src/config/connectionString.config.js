import mongoose from "mongoose"
import { environment } from "./config.js"

const connectionString = environment.mongoUrl

const connectMongoDB = async () => {
    try {
        await mongoose.connect(connectionString)
        console.log('Conectado a mongoDB')
    } catch (error) {
        console.log(error)
        process.exit()
    }
}

export default connectMongoDB