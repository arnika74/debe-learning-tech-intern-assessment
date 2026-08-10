export type RescheduleReason =
  | "Conflict"
  | "Illness"
  | "Time zone"
  | "Other";

export interface RescheduleRequest {
  existingSlotUtc: string;
  newSlotUtc: string;
  reason: RescheduleReason;
}

export interface RescheduleResponse {
  success: boolean;
  error?: string;
}