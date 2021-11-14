// import trotApiService from "./trot-api-service";
import ApiService from "./apiService";
import { IHorseEvents } from "../interfaces/horseEventInterface";
import { StatusCodes } from "http-status-codes";
import { EVENT_TYPE, EVENT_DELAY } from "../config/constants";

class RaceService {
  private apiService: ApiService;
  timeoutId: any;

  constructor() {
    this.apiService = new ApiService("");
    this.timeoutId = undefined;
  }

  // Initiate simulator by calling authentication method
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

  // Starts for process events
  async raceEvents() {
    try {
      clearTimeout(this.timeoutId); // clear previous checks
      const response = await this.apiService.processEvents();
      const data: IHorseEvents = response.data;

      if (response.status === StatusCodes.UNAUTHORIZED) {
        console.log("Again start from authentication");
        this.initiateToSimulator();
      } else if (response.status === StatusCodes.NO_CONTENT) {
        console.log("204, Race events call after 15 seconds");
        // Race yet to start
        this.timeoutId = setTimeout(() => {
          this.raceEvents();
        }, EVENT_DELAY);
      } else if (
        data &&
        (data.event === EVENT_TYPE.START || data.event === EVENT_TYPE.FINISH)
      ) {
        // Check for other events
        this.raceEvents();
      }
    } catch (error) {
      console.log("Error in raveEvents");
      this.initiateToSimulator();
    }
  }
}

const raceService = new RaceService();
raceService.initiateToSimulator();

export = raceService;
