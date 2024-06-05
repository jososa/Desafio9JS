import dotenv from "dotenv"

dotenv.config()

export const environment = {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    mongoSecret: process.env.MONGO_SECRET,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
}