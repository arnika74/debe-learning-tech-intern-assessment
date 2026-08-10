"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Session } from "@/types/session";

interface SessionCardProps {
  session: Session;
  onReschedule: (session: Session) => void;
}

export function SessionCard({
  session,
  onReschedule,
}: SessionCardProps) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const localDate = new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(session.datetime));

    setFormattedDate(localDate);
  }, [session.datetime]);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl">
              {session.subject}
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Tutoring Session
            </p>
          </div>

          <Badge variant="secondary">
            {session.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div className="flex items-center gap-3 text-sm">
          <UserRound className="h-4 w-4 text-muted-foreground" />
          <span>{session.teacherName}</span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <span>
            {formattedDate || "Loading local time..."}
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Your local time</span>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          onClick={() => onReschedule(session)}
        >
          Request Reschedule
        </Button>
      </CardFooter>
    </Card>
  );
}