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

### What problem does the project solve?

Traditional research often requires users to manually search across multiple websites, open and read different sources, identify relevant information, remove irrelevant content, and then summarize the findings into a useful report. This process can be time-consuming, especially when a user needs to gather information from multiple sources.

The Energy Research App aims to reduce this manual effort by providing an AI-powered research workflow. A user can submit a research query through the frontend, and the application automatically searches for relevant information, scrapes and processes the retrieved content, filters important insights, and generates a structured research report using an LLM.

The application uses a pipeline of Research, Analysis, and Summary agents to divide the research process into separate stages. The generated report is then stored and indexed using FAISS, allowing the processed research information to be managed and retrieved efficiently.

Overall, the project aims to make the research process faster, more structured, and less dependent on manually collecting and summarizing information from multiple sources.

### What I Specifically Built

As part of the team, I primarily contributed to the development, integration, and deployment of the application. On the development side, I worked on the React frontend and its communication with the FastAPI API layer and backend processing workflow.

I also worked with the application's agentic/GenAI workflow and contributed to integrating the different stages of the research pipeline with the application. The processing flow involves a Research Agent for web search and scraping, an Analysis Agent for extracting relevant information, and a Summary Agent that generates the final report using an LLM.

On the deployment and DevOps side, I worked with Docker, GitHub Actions, CI/CD, and AWS EC2 to containerize, automate, and deploy the application.

One technical challenge I worked on was maintaining the end-to-end request and response flow across the frontend, API layer, backend processing pipeline, and asynchronous agent workflow. Since the research process runs through multiple stages and returns a job ID before the final result is available, maintaining a reliable polling and response flow was important for ensuring that the generated report was correctly delivered and displayed on the frontend.

### Design Decision I Would Make Differently Today

If I were redesigning the application today, I would make the communication contracts between the frontend, API layer, backend processing pipeline, and agents more explicit by defining shared request, job-status, and response schemas.

Because the research process is asynchronous and involves multiple processing stages, having clearly defined contracts for each stage would make the system easier to debug and maintain. It would also reduce the possibility of response-format mismatches when changes are made to one part of the pipeline.

## 3. Repository 2 — Zerodha Clone

**Repository:**
https://github.com/arnika74/Zerodha-Clone

**Project Type:** Individual Project

**My Role:** Sole Developer

### What problem does the project solve?

The Zerodha Clone is a full-stack web application inspired by the interface and workflow of an online stock trading platform. I built it as a practical project to understand how a modern MERN application can be structured across the frontend, backend, database, and API layers.

The application provides different trading-platform-style sections and dashboard functionality, allowing me to practice building interactive interfaces, managing application data, connecting frontend components with backend APIs, and working with a MongoDB database.

### What I Specifically Built

I developed the application independently using the MERN stack. I worked on the React frontend, implemented the application pages and dashboard features, connected the frontend with the Node.js and Express.js backend, and worked with MongoDB for data storage.

I also implemented the required API interactions and integrated the different parts of the application so that the frontend, backend, and database worked together as a complete full-stack application.

### Design Decision I Would Make Differently Today

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

[To be completed]

---

# Part 4 — Explain-It-Yourself Video

**Video Link:**
[To be added]

**Access:** Anyone with the link

---

# Final Submission

**Assessment Repository:**
[To be added]

**Video:**
[To be added]
