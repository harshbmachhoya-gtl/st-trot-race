import { IHorseEvents } from "./horseEventInterface";

// Horse event response interface
export interface IEventResponse {
  status: number;
  data: IHorseEvents;
}
