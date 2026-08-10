"use client";

import { useState } from "react";
import { RescheduleForm } from "@/components/reschedule-form";
import { SessionCard } from "@/components/session-card";
import { sessions } from "@/data/sessions";
import type { Session } from "@/types/session";

export default function Home() {
  const [selectedSession, setSelectedSession] =
    useState<Session | null>(null);

  const [formOpen, setFormOpen] = useState(false);

  const handleReschedule = (session: Session) => {
    setSelectedSession(session);
    setFormOpen(true);
  };

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium text-primary">
            Parent Portal
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            Upcoming Tutoring Sessions
          </h1>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            View your student&apos;s upcoming tutoring sessions
            and request a reschedule when needed.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <SessionCard
              key={`${session.teacherName}-${session.datetime}`}
              session={session}
              onReschedule={handleReschedule}
            />
          ))}
        </div>
      </div>

      <RescheduleForm
        session={selectedSession}
        open={formOpen}
        onOpenChange={setFormOpen}
      />
    </main>
  );
}