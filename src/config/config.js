import dotenv from "dotenv"

const envFile = process.env.NODE_ENV === "production" ? ".env" : ".env.dev"
dotenv.config({ path: envFile })

export const environment = {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    mongoSecret: process.env.MONGO_SECRET,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    NODE_ENV: process.env.NODE_ENV
}