# Debe Learning — Tech Intern Assessment

This repository contains my submission for the **Debe Learning Tech Intern Assessment** for the **Tech Intern (Web/Portal Engineering)** role.

The assessment covers GitHub portfolio projects, debugging, a Next.js build task, and an explain-it-yourself video walkthrough.

Drive Link : https://drive.google.com/drive/folders/1C7KiaOQ4mGqJ7AhXNfi2pQrxjQBEJZAL?usp=sharing

---

# Repository Structure

~~~text
debe-learning-tech-intern-assessment/
│
├── part2-debug/
│   ├── original.ts
│   └── fixed.ts
│
├── session-reschedule-widget/
│   ├── app/
│   ├── components/
│   ├── data/
│   ├── functions/
│   ├── types/
│   └── README.md
│
├── README.md
└── SUBMISSION.md
~~~

---

# Part 1 — GitHub Portfolio Walkthrough

## Project 1 — Energy Research App

**Repository:**  
https://github.com/arnika74/Energy-Research-App

The Energy Research App is a full-stack AI-powered research application designed to help users research energy-related topics and generate structured research reports.

### Problem It Solves

Researching an energy-related topic can require searching multiple sources, reading large amounts of information, filtering irrelevant content, and manually creating a structured report.

The application aims to simplify this process by using an AI-powered research pipeline that collects information, analyzes it, and generates a structured research report.

### My Contribution

This was a **team project**, and my primary contribution was on the **development and deployment side**.

I worked with:

- React frontend
- Node.js API layer
- FastAPI backend
- Agentic / GenAI workflow
- GitHub Actions
- Docker
- AWS EC2
- CI/CD

### Application Workflow

~~~text
User Query
    │
    ▼
Research Agent
    │
    ▼
Web Search + Scraping
    │
    ▼
Analysis Agent
    │
    ▼
Filtering + Key Insight Extraction
    │
    ▼
Summary Agent
    │
    ▼
LLM-generated Report
    │
    ▼
Storage + FAISS Indexing
    │
    ▼
Frontend
~~~

One of the major engineering challenges I worked with was maintaining the connection and response flow between the frontend, FastAPI API server, backend processing layer, and the multi-agent workflow.

The application uses asynchronous processing and polling so that long-running research tasks can be processed without blocking the user interface.

### Design Decision I Would Reconsider

If I were rebuilding the project today, I would make the communication between the frontend, API server, and long-running agent pipeline more explicit by introducing clearer job states.

For example:

~~~text
queued → processing → completed
                    ↘ failed
~~~

This would make error handling, retries, and user feedback easier to manage as the system grows.

---

## Project 2 — Zerodha Clone

**Repository:**  
https://github.com/arnika74/Zerodha-Clone

The Zerodha Clone is an individual MERN-stack project built to recreate the core experience and functionality of a stock-trading platform.

### Problem It Solves

The project simulates the core experience of an online stock-trading platform and demonstrates how a modern full-stack application can connect a frontend, backend APIs, authentication, and database operations.

### My Contribution

This was an **individual project**, and I built the application end-to-end.

Technologies used include:

- MongoDB
- Express.js
- React
- Node.js
- JavaScript
- REST APIs
- Authentication
- Frontend/backend integration

The project helped me understand how a frontend application communicates with backend APIs, how data is stored and retrieved from MongoDB, and how different application features can be organized into a full-stack architecture.

### Design Decision I Would Reconsider

If I were rebuilding the project today, I would define a cleaner API contract and reusable service structure before implementing individual features.

This would make the application easier to maintain and extend as additional functionality is added.

---

# Part 2 — Debugging Round

The `part2-debug` directory contains both the intentionally buggy Cloud Function provided for the assessment and my corrected implementation.

~~~text
part2-debug/
├── original.ts
└── fixed.ts
~~~

The debugging exercise covers issues involving:

- Logic
- Async / await handling
- TypeScript
- Security

The corrected implementation includes comments above the fixes explaining what was wrong and why the issue could cause problems in production.

---

# Part 3 — Build Task: Session Reschedule Widget

The **Session Reschedule Widget** is a self-contained parent-facing feature built using Next.js App Router and TypeScript.

The widget simulates functionality that could exist in a tutoring portal.

## Problem It Solves

Parents may need to change the time of an upcoming tutoring session because of:

- Schedule conflicts
- Illness
- Timezone differences
- Other personal reasons

A useful rescheduling flow should allow the parent to view upcoming sessions, select a session, request a new time, provide a reason, and receive clear feedback.

The system should also prevent invalid and last-minute rescheduling requests while handling timezone differences correctly.

## How the Solution Works

The widget displays the student's next three upcoming tutoring sessions using mocked data.

Each session contains:

- Subject
- Teacher name
- Date/time
- Status

Each session also has a **Request Reschedule** button.

The reschedule form allows the parent to:

- Select a new date and time
- Select a reason:
  - Conflict
  - Illness
  - Time zone
  - Other

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

---

## Two-Hour Lead-Time Policy

A tutoring session should not normally be rescheduled immediately before it starts because the teacher and tutoring system need reasonable notice.

To reflect this real-world constraint, the form prevents the parent from selecting a time within **two hours of the current time**.

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

This prevents an invalid request from being accepted by bypassing the frontend restriction.

---

## Local Time and UTC Handling

The parent interacts with the scheduling form using their **local browser time**.

The selected value is converted to UTC before being sent to the reschedule function.

This is important because the HTML `datetime-local` input does not contain timezone information by itself.

The implementation therefore follows this flow:

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
UTC value sent to
requestReschedule()
~~~

This allows the parent to work with a familiar local time while the application uses UTC as the timezone-independent value.

The timezone conversion is explicitly handled in the code rather than assuming that the selected `datetime-local` value is already UTC.

---

## Reschedule Validation

The locally mocked `requestReschedule` function validates the requested slot.

It checks that:

1. The new slot is valid.
2. The new slot is not in the past.
3. The new slot is not identical to the existing session slot.

The function returns a typed response:

~~~typescript
{
  success: boolean;
  error?: string;
}
~~~

This keeps communication between the frontend and function predictable and type-safe.

---

## Type Safety

The implementation uses TypeScript throughout the feature.

Shared types are used for the session, reschedule request, reason, and response structures.

~~~text
types/
├── session.ts
└── reschedule.ts
~~~

The frontend and the mocked Cloud Function use the same reschedule types.

No `any` type is used.

This helps ensure that the data sent from the UI matches the structure expected by the function.

---

## Loading and Error Handling

The reschedule request is asynchronous, so the UI provides loading, error, and success states.

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

---

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

---

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

---

## Incremental Development

The feature was developed incrementally instead of being submitted as a single final commit.

The development sequence was:

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

This maintains a meaningful Git history and follows the assessment requirement for incremental commits.

---

# Part 4 — Explain-It-Yourself Video

The video walkthrough demonstrates the Part 3 implementation and explains the important engineering decisions.

The walkthrough covers:

- Part 3 application structure
- Session rescheduling workflow
- Local-time and UTC conversion
- Two-hour lead-time restriction
- Validation logic
- An intentionally broken piece of functionality
- What breaks after the change and why

## Video Link

**[ADD VIDEO LINK HERE]**

---

# Running the Session Reschedule Widget

Navigate to the widget directory:

~~~bash
cd session-reschedule-widget
~~~

Install dependencies:

~~~bash
npm install
~~~

Start the development server:

~~~bash
npm run dev
~~~

Open the application at:

~~~text
http://localhost:3000
~~~

To create a production build:

~~~bash
npm run build
~~~

---

# Technologies Used

| Area | Technologies |
|---|---|
| Frontend | React, Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Date/Time | date-fns, date-fns-tz |
| Backend / Functions | TypeScript mock Cloud Function |
| AI Project | Agentic AI, GenAI, FAISS |
| Deployment | Docker, AWS EC2, GitHub Actions |
| Version Control | Git, GitHub |

---

# Submission

The written responses for the assessment are maintained in:

~~~text
SUBMISSION.md
~~~

The repository contains:

- GitHub portfolio projects
- Debugging exercise
- Original and corrected implementations
- Session Reschedule Widget
- Shared TypeScript types
- Mock reschedule function
- Two-hour lead-time validation
- Local-time / UTC handling
- Loading and error states
- Incremental Git history
- Part 4 video walkthrough