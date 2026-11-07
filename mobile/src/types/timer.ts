export type TimerStatus = "running" | "paused" | "done";

export interface TimerEntry {
  id: string;
  name: string;
  totalSeconds: number;
  remaining: number;
  status: TimerStatus;
  dismissed: boolean;
}