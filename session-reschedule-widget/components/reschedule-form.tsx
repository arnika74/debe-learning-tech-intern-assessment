"use client";

import { useState } from "react";
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

interface RescheduleFormProps {
  session: Session | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RescheduleForm({
  session,
  open,
  onOpenChange,
}: RescheduleFormProps) {
  const [reason, setReason] = useState<string>("");

  if (!session) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason for rescheduling
            </Label>

            <Select
              value={reason}
              onValueChange={(value) => setReason(value ?? "")}
            >
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Conflict">
                  Conflict
                </SelectItem>

                <SelectItem value="Illness">
                  Illness
                </SelectItem>

                <SelectItem value="Time zone">
                  Time zone
                </SelectItem>

                <SelectItem value="Other">
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button type="button">
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}