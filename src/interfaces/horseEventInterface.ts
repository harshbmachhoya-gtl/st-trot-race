// Horse events data interface
export interface IHorseEvents {
  event: string;
  horse: { id: number; name: string };
  time: number;
  createdAt?: Date;
  updatedAt?: Date;
}
