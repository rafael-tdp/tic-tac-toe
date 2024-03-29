import express from "express";
import mongoose from "mongoose";
import auth from "./src/router/authRouter.js";
import messages from "./src/router/messagesRouter.js";
import users from "./src/router/userRouter.js";
import dotenv from "dotenv";
import cors from "cors";
import authMiddleware from "./src/middlewares/authMiddleware.js";
import removeDeletedUsersMessages from "./src/scripts/removeDeletedUsersMessages.js";

const app = express();
dotenv.config();
app.use(cors());

app.use(express.json());

app.use("/auth", auth);
app.use("/messages", authMiddleware, messages);
app.use("/users", authMiddleware, users);

removeDeletedUsersMessages();

try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Connected to database");
} catch (e) {
    console.error(e);
}

export default app;
