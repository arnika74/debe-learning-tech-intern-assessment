"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

import { requestReschedule } from "@/functions/request-reschedule";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Session } from "@/types/session";
import type { RescheduleReason } from "@/types/reschedule";

interface RescheduleFormProps {
  session: Session | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const reasons: RescheduleReason[] = [
  "Conflict",
  "Illness",
  "Time zone",
  "Other",
];

export function RescheduleForm({
  session,
  open,
  onOpenChange,
}: RescheduleFormProps) {
  const [newSlot, setNewSlot] = useState("");
  const [reason, setReason] = useState<RescheduleReason | "">("");
  const [minimumSlot, setMinimumSlot] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    // The tutoring policy requires at least 2 hours of lead time.
    // datetime-local represents the parent's local wall-clock time,
    // so the minimum value is generated using the browser's local timezone.
    const minimumTime = new Date(Date.now() + 2 * 60 * 60 * 1000);

    setMinimumSlot(format(minimumTime, "yyyy-MM-dd'T'HH:mm"));
  }, [open]);

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);

    if (!session) {
      setError("No session selected.");
      return;
    }

    if (!newSlot) {
      setError("Please select a new date and time.");
      return;
    }

    if (!reason) {
      setError("Please select a reason for rescheduling.");
      return;
    }

    const selectedDate = new Date(newSlot);

    if (Number.isNaN(selectedDate.getTime())) {
      setError("Please select a valid date and time.");
      return;
    }

    const minimumDate = new Date();
    minimumDate.setHours(minimumDate.getHours() + 2);

    if (selectedDate.getTime() < minimumDate.getTime()) {
      setError(
        "Please choose a time at least 2 hours from now.",
      );
      return;
    }

    const timeZone =
      Intl.DateTimeFormat().resolvedOptions().timeZone;

    // datetime-local contains no timezone information.
    // The selected value represents the parent's local time,
    // so we explicitly interpret it in the browser timezone
    // before converting it to UTC for the backend/function.
    const newSlotUtc = fromZonedTime(
      newSlot,
      timeZone,
    ).toISOString();

    const existingSlotUtc = new Date(
      session.datetime,
    ).toISOString();

    try {
      setLoading(true);

      const response = await requestReschedule({
        existingSlotUtc,
        newSlotUtc,
        reason,
      });

      if (!response.success) {
        setError(
          response.error ??
            "Unable to submit the reschedule request.",
        );
        return;
      }

      setSuccess(true);
      setNewSlot("");
      setReason("");
    } catch {
      setError(
        "Something went wrong while submitting the request.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setNewSlot("");
      setReason("");
      setError("");
      setSuccess(false);
    }

    onOpenChange(nextOpen);
  };

  if (!session) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Reschedule</DialogTitle>

          <DialogDescription>
            Choose a new time for your {session.subject} session
            with {session.teacherName}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="new-slot">
              New date and time
            </Label>

            <Input
              id="new-slot"
              type="datetime-local"
              value={newSlot}
              min={minimumSlot}
              onChange={(event) =>
                setNewSlot(event.target.value)
              }
              disabled={loading || success}
            />

            <p className="text-xs text-muted-foreground">
              Times are shown in your local timezone. New slots
              must be at least 2 hours from now.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason for rescheduling
            </Label>

            <Select
              value={reason}
              onValueChange={(value) =>
                setReason(value as RescheduleReason)
              }
              disabled={loading || success}
            >
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>

              <SelectContent>
                {reasons.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="rounded-md border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-700"
            >
              Reschedule request submitted successfully.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading || success}
          >
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}