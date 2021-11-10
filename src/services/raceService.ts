// import trotApiService from "./trot-api-service";
import ApiService, { IEventResponse } from "./apiService";
import { IHorseEvents } from "../interfaces/horseEventInterface";
import { StatusCodes } from "http-status-codes";

class RaceService {
  // for handling different activity of the race
  MAX_HORSES = 6;
  checkEventDelay = 15 * 1000; // 15 seconds
  checkFinishedDelay = 60 * 1000 + 1000; // 1 min + 1s
  horsesMap: { [index: number]: IHorseEvents } = {};
  timeoutId: any = null;

  private apiService: ApiService;

  constructor() {
    this.apiService = new ApiService("");
  }

  async initiateToSimulator() {
    try {
      this.apiService = new ApiService("");
      await this.apiService.authenticateUser();
      this.raceEvents();
    } catch (error) {
      console.log("Error in initiateToSimulator", error);
      this.initiateToSimulator();
    }
  }

  async raceEvents() {
    try {
      clearTimeout(this.timeoutId); // clear previous checks
      const response = await this.apiService.processEvents();
      const data: IHorseEvents = response.data;

      if (response.status === StatusCodes.UNAUTHORIZED) {
        console.log("Again start from authentication");
        this.initiateToSimulator();
      } else if (response.status === StatusCodes.NO_CONTENT) {
        console.log("204, Race events call after 15 seonds");
        // race yet to start
        this.timeoutId = setTimeout(() => {
          this.raceEvents();
        }, this.checkEventDelay);
      } else if (data && (data.event === "start" || data.event === "finish")) {
        // Check for other events
        this.raceEvents();
      }
    } catch (error) {
      console.log("Error in raveEvents");
      this.initiateToSimulator();
      //   this.handleAPIError(error);
    }
  }

  handleAPIError(error: IEventResponse) {
    clearTimeout(this.timeoutId);
    const errorStatus = error && error.status;
    if (errorStatus === 401) {
      this.initiateToSimulator();
    } else if (errorStatus === 204) {
      this.raceEvents();
    } else {
      this.initiateToSimulator();
    }
  }
}

const raceService = new RaceService();
raceService.initiateToSimulator();

export = raceService;
