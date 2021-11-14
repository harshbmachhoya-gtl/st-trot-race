import mongoose from "mongoose";
import app from "../app";
import { IHorseEvents } from "../interfaces/horseEventInterface";

const horseEventSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true,
  },
  horse: {
    type: Object,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
});

// Export the model
export const HorseEventModel = app.getMongoose().model<IHorseEvents>("HorseEvent", horseEventSchema);
