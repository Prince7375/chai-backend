import express from 'express';
import cors from "cors"; // importing middle ware
import cookieParser from 'cookie-parser';

const app = express()

// accepting request from our perticular frontend
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// setting the limit of json
app.use(express.json({limit: "16kb"}))

// encoding the urls and setting the limit
app.use(express.urlencoded({extended: true, limit: "16kb"}))

// use to store file, pgf, image
app.use(express.static("public"))

// to do curd operations with browser cookie
app.use(cookieParser())




//routes import
import userRouter from "../src/routes/user.routes.js"

//routes declaration
app.use("/api/v1/users", userRouter)



export { app }