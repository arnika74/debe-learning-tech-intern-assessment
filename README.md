# Debe Learning — Tech Intern Assessment

This repository contains my submission for the **Debe Learning Tech Intern Assessment** for the **Tech Intern (Web/Portal Engineering)** role.

The assessment focuses on React / Next.js, Firebase Cloud Functions, Node.js + TypeScript, and Git/GitHub.

---

## Repository Overview

The repository is organized according to the four parts of the assessment:

```text
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
├── SUBMISSION.md
└── README.md

Part 1 — GitHub Portfolio Walkthrough
1. Energy Research App

Repository:
https://github.com/arnika74/Energy-Research-App

The Energy Research App is a full-stack AI-powered research application designed to help users research energy-related topics and generate structured research reports.

My Contribution

This was a team project, and my primary contribution was in the development and deployment side of the application.

I worked with:

React frontend
Node.js API layer
FastAPI backend
Agentic / GenAI workflow
GitHub Actions
Docker
AWS EC2
CI/CD
Application Workflow
User Query
    ↓
Research Agent
    ↓
Web Search + Scraping
    ↓
Analysis Agent
    ↓
Filtering + Key Insight Extraction
    ↓
Summary Agent
    ↓
LLM-generated Report
    ↓
Storage + FAISS Indexing
    ↓
Frontend

One of the major engineering challenges was maintaining the connection and response flow across the frontend, FastAPI API server, backend processing layer, and the multi-agent workflow.

The application uses asynchronous processing and polling so that long-running research tasks do not block the user interface.

Design Decision I Would Reconsider

If I were rebuilding the project today, I would improve the communication architecture between the frontend, API server, and long-running agent pipeline by making job states and failure handling more explicit.

For example:

queued → processing → completed
                    ↘ failed

This would make retries, error handling, and user feedback easier to manage as the system grows.

2. Zerodha Clone

Repository:
https://github.com/arnika74/Zerodha-Clone

The Zerodha Clone is an individual MERN-stack project built to recreate the core experience and functionality of a stock-trading platform.

My Contribution

This was an individual project, and I built the application end-to-end.

Technologies used include:

MongoDB
Express.js
React
Node.js
JavaScript
REST APIs
Authentication
Frontend/backend integration

The project helped me understand how a frontend application communicates with backend APIs, how data is stored and retrieved from MongoDB, and how different application features can be organized into a full-stack architecture.

Design Decision I Would Reconsider

If I were rebuilding the project today, I would spend more time defining a cleaner API contract and reusable service structure before implementing individual features.

This would make the codebase easier to extend and maintain as more trading-related functionality is added.

Part 2 — Debugging Round

The part2-debug directory contains both the intentionally buggy Cloud Function provided for the assessment and my corrected implementation.

part2-debug/
├── original.ts
└── fixed.ts

The debugging exercise covers issues involving:

Logic
Async / await handling
TypeScript
Security

The corrected version includes comments above the fixes explaining what was wrong and why the issue could cause problems in production.

Part 3 — Session Reschedule Widget

The Session Reschedule Widget is a small parent-facing feature built to simulate functionality that could exist in a tutoring portal.

Tech Stack
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
date-fns
date-fns-tz
Features

The widget displays the student's next three upcoming tutoring sessions.

Each session contains:

Subject
Teacher name
Date and time
Status
Request Reschedule button

The reschedule form provides:

Date/time picker
Conflict reason
Illness reason
Time zone reason
Other reason
Reschedule Flow
Parent selects a session
        ↓
Clicks "Request Reschedule"
        ↓
Selects local date/time
        ↓
Selects reason
        ↓
Frontend validates the request
        ↓
Local time is converted to UTC
        ↓
requestReschedule()
        ↓
Validation in mock Cloud Function
        ↓
Typed success/error response
        ↓
Result displayed to parent
Two-Hour Lead-Time Policy

The reschedule form prevents the parent from selecting a time within two hours of the current time.

For example:

Current time: 6:00 PM

6:30 PM   ❌
7:00 PM   ❌
7:59 PM   ❌
8:00 PM   ✅

This rule is implemented as a form-level constraint and is also checked during submission.

The purpose of this constraint is to reflect a realistic tutoring lead-time policy and prevent last-minute rescheduling requests.

Local Time and UTC Handling

The parent interacts with the form using their local browser time.

The selected value is converted to UTC before being sent to the reschedule function.

Parent's local time
        ↓
Browser timezone detected
        ↓
Local time interpreted in that timezone
        ↓
Converted to UTC
        ↓
UTC ISO string sent to the function

This keeps stored session data timezone-independent while allowing the parent to interact with the form using their local time.

The timezone conversion is explicitly handled in the code because datetime-local does not contain timezone information.

Reschedule Validation

The mock requestReschedule function validates that:

The new slot is a valid date.
The new slot is not in the past.
The new slot is not identical to the existing session slot.

It returns a typed response:

{
  success: boolean;
  error?: string;
}

The frontend also provides:

Loading state
Error state
Success state
Safe async handling

No any type is used in the implementation.

Shared TypeScript Types

The request and response contracts are defined using shared TypeScript types so that the frontend and mock function use the same structure.

types/
├── session.ts
└── reschedule.ts

This keeps the frontend/function contract explicit and type-safe.

Incremental Git History

Part 3 was developed incrementally instead of being submitted as a single final commit.

The development sequence was:

Scaffold
   ↓
UI
   ↓
Validation logic
   ↓
Styling / polish

This maintains a meaningful development history and makes the implementation process easy to review.

Part 4 — Explain-It-Yourself Video

The video walkthrough covers the Part 3 implementation and explains the main engineering decisions.

The walkthrough includes:

Part 3 application structure
Reschedule flow
Local-time / UTC conversion
Two-hour lead-time restriction
Validation logic
An intentionally broken piece of functionality
The resulting behavior and why it breaks

Video:
Add the final Loom / Google Drive video link here.

Running the Project
Part 3 — Session Reschedule Widget

Navigate to the widget directory:

cd session-reschedule-widget

Install dependencies:

npm install

Start the development server:

npm run dev

Open:

http://localhost:3000

To create a production build:

npm run build
Technologies Used
Area	Technologies
Frontend	React, Next.js
Language	TypeScript
Styling	Tailwind CSS, shadcn/ui
Date/Time	date-fns, date-fns-tz
Backend / Functions	TypeScript mock Cloud Function
Version Control	Git, GitHub
Debugging	Firebase Cloud Functions, TypeScript
Submission

The written responses for the assessment are maintained in:

SUBMISSION.md

This repository contains the portfolio projects, debugging exercise, Session Reschedule Widget, documentation, and supporting material for the assessment.


### One small thing before you commit

In the README, leave this:

```markdown
**Video:**  
_Add the final Loom / Google Drive video link here._