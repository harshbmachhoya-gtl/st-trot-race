import { Method } from "axios";

// REST API parameters interface
export interface IApiParams {
  endPoints: string;
  params?: any;
  method: Method;
  token: string;
  header: any;
}
