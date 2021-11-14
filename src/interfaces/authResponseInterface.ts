// User authentication interface
export interface IAuthResponse {
  status: number;
  data: { token: string; error: string };
}
