# Debe Learning — Tech Intern Assessment Submission

**Candidate:** Arnika Jain
**Role:** Tech Intern (Web/Portal Engineering)

---
# Part 1 — GitHub Portfolio Walkthrough

## 1. GitHub Profile
GitHub:
https://github.com/arnika74/

## 2. Repository 1 — Energy Research App
**Repository:**
https://github.com/arnika74/Energy-Research-App

**Project Type:** Team Project

**My Role:** Development and Deployment

### Q. What problem does the project solve?
Traditional research often requires users to manually search across multiple websites, open and read different sources, identify relevant information, remove irrelevant content, and then summarize the findings into a useful report. This process can be time-consuming, especially when a user needs to gather information from multiple sources.

The Energy Research App aims to reduce this manual effort by providing an AI-powered research workflow. A user can submit a research query through the frontend, and the application automatically searches for relevant information, scrapes and processes the retrieved content, filters important insights, and generates a structured research report using an LLM.

The application uses a pipeline of Research, Analysis, and Summary agents to divide the research process into separate stages. The generated report is then stored and indexed using FAISS, allowing the processed research information to be managed and retrieved efficiently.

Overall, the project aims to make the research process faster, more structured, and less dependent on manually collecting and summarizing information from multiple sources.

### Q. What I Specifically Built
As part of the team, I primarily contributed to the development, integration, and deployment of the application. On the development side, I worked on the React frontend and its communication with the FastAPI API layer and backend processing workflow.

I also worked with the application's agentic/GenAI workflow and contributed to integrating the different stages of the research pipeline with the application. The processing flow involves a Research Agent for web search and scraping, an Analysis Agent for extracting relevant information, and a Summary Agent that generates the final report using an LLM.

On the deployment and DevOps side, I worked with Docker, GitHub Actions, CI/CD, and AWS EC2 to containerize, automate, and deploy the application.

One technical challenge I worked on was maintaining the end-to-end request and response flow across the frontend, API layer, backend processing pipeline, and asynchronous agent workflow. Since the research process runs through multiple stages and returns a job ID before the final result is available, maintaining a reliable polling and response flow was important for ensuring that the generated report was correctly delivered and displayed on the frontend.

### Q. Design Decision I Would Make Differently Today
If I were redesigning the application today, I would make the communication contracts between the frontend, API layer, backend processing pipeline, and agents more explicit by defining shared request, job-status, and response schemas.

Because the research process is asynchronous and involves multiple processing stages, having clearly defined contracts for each stage would make the system easier to debug and maintain. It would also reduce the possibility of response-format mismatches when changes are made to one part of the pipeline.

## 3. Repository 2 — Zerodha Clone
**Repository:**
https://github.com/arnika74/Zerodha-Clone

**Project Type:** Individual Project

**My Role:** Sole Developer

### Q. What problem does the project solve?
The Zerodha Clone is a full-stack web application inspired by the interface and workflow of an online stock trading platform. I built it as a practical project to understand how a modern MERN application can be structured across the frontend, backend, database, and API layers.

The application provides different trading-platform-style sections and dashboard functionality, allowing me to practice building interactive interfaces, managing application data, connecting frontend components with backend APIs, and working with a MongoDB database.

### Q. What I Specifically Built
I developed the application independently using the MERN stack. I worked on the React frontend, implemented the application pages and dashboard features, connected the frontend with the Node.js and Express.js backend, and worked with MongoDB for data storage.

I also implemented the required API interactions and integrated the different parts of the application so that the frontend, backend, and database worked together as a complete full-stack application.

### Q. Design Decision I Would Make Differently Today
If I were rebuilding the project today, I would put more emphasis on creating a clearer reusable component and state-management structure from the beginning.

As the number of dashboard sections and UI components grows, keeping shared data and UI logic organized becomes increasingly important. I would separate reusable components, API-related logic, and application state more systematically so that adding new features would require less duplication and the project would be easier to maintain.

---
# Part 2 — Debugging Round

The supplied Cloud Function contained issues related to asynchronous Firestore operations, runtime input validation, and authentication.

## Bug 1 — Authentication / Security
The callable function did not verify whether the caller was authenticated before creating a booking. The function received `context`, but the authentication information was not checked.

### Fix : 
I added a `context.auth` check and return an `unauthenticated` error when there is no authenticated user.

### Production impact :
Without authentication, an unauthenticated client could invoke the callable function directly and potentially create bookings.

## Bug 2 — Runtime Input Validation
The `BookingRequest` interface provides TypeScript compile-time information, but it does not validate data received from a client at runtime.

### Fix :
I added runtime checks to verify that `studentId`, `teacherId`, `slot`, and `subject` are strings and are not empty.

### Production impact :
Client input should be treated as untrusted. Without runtime validation, malformed data could reach the application logic or database.

## Bug 3 — Asynchronous Firestore Read
The `.get()` operation returns a Promise, but the original code attempted to access `existing.docs` before waiting for the Firestore query to complete.

### Fix :
I made the callable function asynchronous and used `await` when retrieving the Firestore query result.

### Production impact :
Waiting for the query to complete ensures that the slot availability check uses the actual Firestore result instead of a pending Promise.

## Bug 4 — Asynchronous Firestore Write
The original code called `.add(booking)` without awaiting the database write and immediately returned a successful response.

### Fix :
I used `await` for the Firestore write before returning `{ success: true }`.

### Production impact :
This ensures the function does not report a successful booking before the database operation has completed.

## Overall bug summary :-

| Bug                              | Problem                                                                     | Fix                  |
| -------------------------------- | --------------------------------------------------------------------------- | -------------------- |
| **1. Async read**                | Firestore `.get()` returns a Promise, but code accesses `.docs` immediately | `await .get()`       |
| **2. Async write**               | Firestore `.add()` isn't awaited before returning success                   | `await .add()`       |
| **3. Security**                  | No authentication check before creating a booking                           | Check `context.auth` |
| **4. Runtime typing/validation** | TypeScript interface doesn't validate client data at runtime                | Validate `data`      |

---

# Part 3 — Session Reschedule Widget

## Problem It Solves

Parents may need to change the time of an upcoming tutoring session because of a schedule conflict, illness, timezone differences, or another reason.

A useful rescheduling flow should allow the parent to:

- View upcoming tutoring sessions.
- Select the session they want to reschedule.
- Choose a new date and time.
- Provide a reason for the request.
- Prevent invalid or last-minute rescheduling requests.
- Handle timezone differences correctly.
- Receive clear feedback when the request succeeds or fails.

To simulate this workflow, I built a self-contained **Session Reschedule Widget** using Next.js, React, and TypeScript.

## How My Solution Solves the Problem

The widget displays the student's next three upcoming tutoring sessions using mocked data.

Each session contains:

- Subject
- Teacher name
- Date/time
- Status

Each session also provides a **Request Reschedule** button.

When the parent clicks the button, a rescheduling form opens where they can:

- Select a new date and time.
- Select a reason:
  - Conflict
  - Illness
  - Time zone
  - Other

The request is then sent to a locally mocked `requestReschedule` function. The function validates the requested slot and returns a typed response.

### Overall Flow

~~~text
Parent views upcoming sessions
            │
            ▼
     Selects a session
            │
            ▼
  Clicks "Request Reschedule"
            │
            ▼
   Selects new date/time
            │
            ▼
      Selects a reason
            │
            ▼
    Frontend validation
            │
            ▼
    Local time → UTC
            │
            ▼
    requestReschedule()
            │
            ▼
    Server-side validation
            │
            ▼
    Success / Error response
            │
            ▼
    Result shown to parent
~~~

## Why the Validation Is Important

The rescheduling feature should not accept every date and time entered by the parent.

The mock `requestReschedule` function validates that:

1. The new slot is valid.
2. The new slot is not in the past.
3. The new slot is different from the existing session time.

It returns the following typed response:

~~~typescript
{
  success: boolean;
  error?: string;
}
~~~

This keeps the frontend/function communication predictable and prevents invalid requests from being accepted.

## Two-Hour Lead-Time Policy

A tutoring session should not normally be rescheduled immediately before it starts because the teacher and tutoring system need reasonable notice.

To reflect this real-world constraint, I implemented a **two-hour lead-time policy**.

The form disables times that fall within two hours of the current time.

For example, if the current time is:

~~~text
6:00 PM
~~~

then:

~~~text
6:30 PM   ❌ Disabled
7:00 PM   ❌ Disabled
7:59 PM   ❌ Disabled
8:00 PM   ✅ Available
~~~

This rule is also checked during submission rather than relying only on the UI.

This prevents a user from bypassing the restriction simply by sending an invalid request directly to the function.

## Local Time and UTC Handling

Timezone handling is important because a parent and tutoring system may operate in different timezones.

The parent should see and select the session time in their **local timezone**, because this is the most natural way for them to interact with the scheduling form.

However, the application should not store timezone-dependent local values as the source of truth.

Therefore, my implementation follows this flow:

~~~text
Parent selects local date/time
            │
            ▼
Browser timezone is determined
            │
            ▼
Local date/time is interpreted
using that timezone
            │
            ▼
       Converted to UTC
            │
            ▼
    UTC value sent to the
    requestReschedule function
~~~

The value is therefore stored/requested in UTC while the parent continues to interact with the application using their local time.

This distinction is especially important because the HTML `datetime-local` input does not include timezone information by itself.

The timezone conversion is explicitly handled in the code rather than assuming that the selected value is already UTC.

## Type Safety

The implementation uses TypeScript throughout the feature.

The session, reschedule request, reason, and response structures are represented using shared types.

The relevant type structure is:

~~~text
types/
├── session.ts
└── reschedule.ts
~~~

The frontend and the mocked Cloud Function use the same reschedule types.

No `any` type is used.

This helps ensure that the data sent from the UI matches the structure expected by the function.

## Loading and Error Handling

The reschedule request is asynchronous, so the UI includes appropriate loading, error, and success states.

### Loading State

While the request is being processed:

- The submit button is disabled.
- A loading state is displayed.
- The user cannot accidentally submit the same request multiple times.

### Error State

If validation fails or the request returns an error, the error is displayed in the UI.

The asynchronous request is handled so that there are no unhandled promise rejections.

### Success State

After a successful request, the parent receives a clear confirmation that the reschedule request was submitted successfully.

## Technical Implementation

The feature was built using:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- date-fns
- date-fns-tz

The Firebase Cloud Function was mocked locally because the assessment allows the function to be stubbed locally and does not require a deployed Firebase project.

## Project Structure

~~~text
session-reschedule-widget/
│
├── app/
│   └── page.tsx
│
├── components/
│   ├── session-card.tsx
│   ├── reschedule-form.tsx
│   └── ui/
│
├── data/
│   └── sessions.ts
│
├── functions/
│   └── request-reschedule.ts
│
├── types/
│   ├── session.ts
│   └── reschedule.ts
│
└── README.md
~~~

## Incremental Development

I developed the feature incrementally instead of making one final commit.

The implementation was completed in the following stages:

~~~text
        Scaffold
           │
           ▼
           UI
           │
           ▼
    Validation Logic
           │
           ▼
     Styling / Polish
~~~

This maintains a meaningful Git history and reflects the incremental development requirement of the assessment.

## Result

The completed widget provides a complete rescheduling flow for a parent:

~~~text
View upcoming sessions
        │
        ▼
Choose a session
        │
        ▼
Request reschedule
        │
        ▼
Choose local date/time
        │
        ▼
Choose reason
        │
        ▼
Validate request
        │
        ▼
Convert local time to UTC
        │
        ▼
Process request
        │
        ▼
Show success or error
~~~

The implementation combines the required UI, validation, timezone handling, lead-time policy, typed function response, and asynchronous state handling into one self-contained feature.

# Part 4 — Explain-It-Yourself Video

**Video Link:**
https://drive.google.com/drive/folders/1C7KiaOQ4mGqJ7AhXNfi2pQrxjQBEJZAL?usp=sharing

**Access:** Anyone with the link

---

