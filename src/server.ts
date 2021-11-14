import dotenv from "dotenv";
dotenv.config();
import app from "./app";

// Initiate app with worker thread
app.initiateApp();
