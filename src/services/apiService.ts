import axios from "axios";
import { StatusCodes } from "http-status-codes";
import { IHorseEvents } from "../interfaces/horseEventInterface";
import { HorseEventModel } from "../models/horseEventModel";

export interface IEventResponse {
  status: number;
  data: IHorseEvents;
}

const simulatorUrl: string = process.env.API_ROOT || "";

class ApiService {
  token: string = "";

  constructor(_token: string) {
    this.token = _token;
  }

  // User authentication and return token
  async authenticateUser(): Promise<string> {
    try {
      const result = await axios.post(
        simulatorUrl + "/auth",
        {
          email: process.env.API_EMAIL,
          password: process.env.API_PASSWORD,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Token recieved: \n" + result.data.token);
      this.token = result.data.token;
    } catch (err) {
      console.log("Authentication error: " + err);
    }
    return this.token;
  }

  // Fetches real-time events
  async getEvents(): Promise<IEventResponse> {
    const eventResponse: IEventResponse = {
      status: StatusCodes.OK,
      data: {
        event: "",
        horse: { id: 0, name: "" },
        time: 0,
      },
    };

    const options = {
      headers: {
        Authorization: "Bearer " + this.token,
        "Content-Type": "application/json",
      },
    };

    try {
      const result = await axios.get(simulatorUrl + "/results", options);
      if (result.status === 200) {
        eventResponse.data = result.data;
        console.log("Event received");
      } else if (result.status === StatusCodes.UNAUTHORIZED) {
        eventResponse.status = result.status;
        console.log("Event unauthorized");
      } else if (result.status === StatusCodes.NO_CONTENT) {
        eventResponse.status = result.status;
        console.log("No event received");
      }
    } catch (err: any) {
      if (
        err &&
        err.response &&
        err.response.status === StatusCodes.UNAUTHORIZED
      ) {
        eventResponse.status = err.response.status;
        console.log("Event unauthorized");
      } else {
        console.log("Event received error: " + err);
      }
    }
    return eventResponse;
  }

  async processEvents(): Promise<IEventResponse> {
    console.log("getEvents calling");
    const eventResponse: IEventResponse = await this.getEvents();
    console.log(eventResponse);
    if (eventResponse.status === StatusCodes.OK) {
      const eventModel = new HorseEventModel({
        event: eventResponse.data.event,
        horse: eventResponse.data.horse,
        time: eventResponse.data.time,
      });

      try {
        await eventModel.save();
        console.info("Event saved");
      } catch (err) {
        console.error("Event saving error: " + err);
      }
    }
    return eventResponse;
  }
}

export default ApiService;
