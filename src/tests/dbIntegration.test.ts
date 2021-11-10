import app from "../app";
import { IHorseEvents } from "../interfaces/horseEventInterface";
import { HorseEventModel } from "../models/horseEventModel";

describe("Database integration operations", () => {
  const startEvent: IHorseEvents = {
    event: "start",
    horse: {
      id: 26,
      name: "Phantom",
    },
    time: 0,
  };
  const finishEvent: IHorseEvents = {
    event: "finish",
    horse: {
      id: 26,
      name: "Phantom",
    },
    time: 10016,
  };
  let recordId: string;

  it("should db connect successfully",async  () => {
    const connection = await app.connectDB();
    expect(connection).toBeTruthy();
  });

  // Start event
  it("should add new event successfully", async () => {
    const event = new HorseEventModel(startEvent);
    const response = await event.save();
    recordId = response._id.toString();
    expect(response).toBeTruthy();
  });
  it("should have event if find by record id", async () => {
    const resp = await HorseEventModel.findById(recordId);
    expect(resp).not.toBeUndefined();
  });
  it("should delete event with given ID", async () => {
    const resp = await HorseEventModel.findByIdAndDelete(recordId);
    expect(resp && resp._id.toString()).toBe(recordId);
  });
  it("should not have event of deleted id", async () => {
    const resp = await HorseEventModel.findById(recordId);
    expect(resp).toBeNull();
  });
  it("should not have event of deleted record", async () => {
    const resp = await HorseEventModel.findOne({
      event: "start",
      horse: { id: 26, name: "Phantom" },
    });
    expect(resp).toBeNull();
  });

  // Finish event
  it("should add new finish event successfully", async () => {
    const event = new HorseEventModel(finishEvent);
    const response = await event.save();
    recordId = response._id.toString();
    expect(response).toBeTruthy();
  });
  it("should have event if find by data", async () => {
    const resp = await HorseEventModel.findOne({ event: "finish" });
    expect(resp).toBeDefined();
  });
  it("should delete event with given data", async () => {
    const resp = await HorseEventModel.findOneAndDelete({ event: "finish" });
    expect(resp && resp._id.toString()).toBe(recordId);
  });

  afterAll((done) => {
    app.closeConnection(); // close db connection
    done();
  });
});
