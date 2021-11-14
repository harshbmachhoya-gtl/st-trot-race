import { Method } from "axios";

// Method Constant
export const METHOD = {
  GET: "GET" as Method,
  PUT: "PUT" as Method,
  POST: "POST" as Method,
  DELETE: "DELETE" as Method,
};

// Event Type Constants
export const EVENT_TYPE = {
  START: "start",
  FINISH: "finish",
};

// Application/JSON header
const headers = {
  "Content-Type": "application/json",
};

// Define endpoint, method and header for API
export const API = {
  AuthToken: { endpoint: "/auth", method: METHOD.POST, header: headers },
  Results: { endpoint: "/results", method: METHOD.GET, header: headers },
};

// Event delay time in seconds for long-pooling
export const EVENT_DELAY = 15 * 1000; // 15 seconds
