import type {
  RescheduleRequest,
  RescheduleResponse,
} from "@/types/reschedule";

export async function requestReschedule(
  request: RescheduleRequest,
): Promise<RescheduleResponse> {
  const existingSlot = new Date(request.existingSlotUtc);
  const newSlot = new Date(request.newSlotUtc);

  if (Number.isNaN(newSlot.getTime())) {
    return {
      success: false,
      error: "Invalid reschedule time.",
    };
  }

  if (newSlot.getTime() < Date.now()) {
    return {
      success: false,
      error: "The new session time cannot be in the past.",
    };
  }

  if (newSlot.getTime() === existingSlot.getTime()) {
    return {
      success: false,
      error: "The new session time must be different from the existing time.",
    };
  }

  return {
    success: true,
  };
}