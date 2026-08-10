# Session Reschedule Widget

A parent-facing tutoring session reschedule widget built with Next.js App Router and TypeScript.

## Features

- Displays a student's next 3 upcoming tutoring sessions
- Shows subject, teacher, local date/time, and status
- Opens a reschedule form for each session
- Supports reschedule reasons:
  - Conflict
  - Illness
  - Time zone
  - Other
- Prevents selecting times within 2 hours of the current time
- Converts the parent's local time to UTC before submission
- Validates that the new time is not in the past
- Validates that the new time differs from the existing session time
- Uses typed request and response contracts
- Includes loading, error, and success states
- Uses a locally mocked Firebase Cloud Function

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- date-fns
- date-fns-tz

## Project Structure

```text
app/
  page.tsx

components/
  session-card.tsx
  reschedule-form.tsx
  ui/

data/
  sessions.ts

functions/
  request-reschedule.ts

types/
  session.ts
  reschedule.ts


Timezone Handling

Session datetimes are stored as UTC ISO strings.

The reschedule input uses the parent's local browser time. Because
datetime-local does not contain timezone information, the browser's
timezone is explicitly determined and the selected local time is
converted to UTC before the request is sent to the reschedule function.

This keeps storage independent of the parent's timezone while allowing
the parent to interact with the form using local time.

Two-Hour Lead-Time Policy

The form disables times earlier than two hours from the current time.

This is implemented using the min attribute on the
datetime-local input and is also checked during submission.

Validation

The mock requestReschedule function validates:

The new slot is a valid date.
The new slot is not in the past.
The new slot is not identical to the existing session slot.

The function returns the typed response:

{
  success: boolean;
  error?: string;
}
Running Locally

Install dependencies:

npm install

Start the development server:

npm run dev

Build the application:

npm run build

Open:

http://localhost:3000
Note

No real Firebase project is required for this assessment. The
requestReschedule function is implemented as a local mock of a Firebase
Cloud Function.


---

