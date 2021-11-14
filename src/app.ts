import { Application } from "express";
import cors from "cors";
import express from "express";
import { Worker } from "worker_threads";
import path from "path";
import mongoose from "mongoose";
import config from "./config/dbConfig";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setConfig();
    this.connectDB();
  }

  // Set common servers configuration
  private setConfig() {
    // Allows us to receive requests with data in json format
    this.app.use(express.json());
    // Allows us to receive requests with data in x-www-form-urlencoded format
    this.app.use(
      express.urlencoded({
        extended: true,
      })
    );
    // Enables cors
    this.app.use(cors());
  }

  // Get mongoose object
  getMongoose() {
    return mongoose;
  }

  // Connect to Mongo DB
  async connectDB() {
    try {
      return await mongoose
        .connect(config.mongoDBPath)
        .then(() => {
          console.log("Database connected!");
          return true;
        })
        .catch((err) => {
          console.log("Error in mongo db connection", err);
          return false;
        });
    } catch (err) {
      console.log("Not able to connect to MongoDB");
    }
  }

  // Close Mongo DB connection
  closeConnection() {
    mongoose.connection.close();
  }

  // Worker thread initialization
  initiateApp() {
    const worker = new Worker(path.resolve(__dirname, "./services/worker.js"), {
      workerData: {
        path: "./raceService.ts",
      },
    });
    worker.on("message", (data) => {
      console.info(data);
    });
    worker.on("error", (error) => {
      console.info(error);
    });
    worker.on("exit", (code) => {
      console.info("Exiting -", code);
    });
  }
}

export default new App();
