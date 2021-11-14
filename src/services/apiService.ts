import { StatusCodes } from "http-status-codes";
import { API } from "../config/constants";
import { IApiParams } from "../interfaces/apiParamInterface";
import { IAuth } from "../interfaces/authInterface";
import { IAuthResponse } from "../interfaces/authResponseInterface";
import { IEventResponse } from "../interfaces/eventResponseInterface";
import { HorseEventModel } from "../models/horseEventModel";
import CommonRestAPI from "./commonRestAPI";

class ApiService {
  token = "";
  callAPI = new CommonRestAPI().callAPI;

  constructor(_token: string) {
    this.token = _token;
  }

  // User authentication and return token
  async authenticateUser(): Promise<string> {
    try {
      const userCredentials: IAuth = {
        email: process.env.API_EMAIL || "",
        password: process.env.API_PASSWORD || "",
      };
      const { endpoint, method, header } = API.AuthToken;
      const paramaters: IApiParams = {
        endPoints: endpoint,
        params: userCredentials,
        method: method,
        token: "",
        header: header,
      };

      const result: IAuthResponse = await this.callAPI(paramaters);

      console.log("Token recieved: \n" + result.data.token);
      this.token = result.data.token;
    } catch (err) {
      console.log("Authentication error: " + err);
    }
    return this.token;
  }

  // Fetche real-time events
  async getEvents(): Promise<IEventResponse> {
    const eventResponse: IEventResponse = {
      status: StatusCodes.NO_CONTENT,
      data: {
        event: "",
        horse: { id: 0, name: "" },
        time: 0,
      },
    };

    try {
      const { endpoint, method, header } = API.Results;
      const paramaters: IApiParams = {
        endPoints: endpoint,
        method: method,
        token: this.token,
        header: {
          ...header,
          Authorization: "Bearer " + this.token,
        },
      };
      const result: IEventResponse = await this.callAPI(paramaters);
      console.log("Event API result:\n", result.status, result.data);
      if (result.status === StatusCodes.OK) {
        eventResponse.data = result.data;
        eventResponse.status = result.status;
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

  // Process events
  async processEvents(): Promise<IEventResponse> {
    console.log("getEvents calling");
    const eventResponse: IEventResponse = await this.getEvents();
    console.log("eventResponse code:", eventResponse.status);
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
