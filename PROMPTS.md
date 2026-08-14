# Prompt Documentation

This document summarizes how AI assistance was used during the planning, development, debugging, and documentation of the SecureLife CRM assignment.

The prompts below are written as representative prompts instead of a full raw chat transcript. They show the intent, decisions, and iterative workflow used to build the project.

## 1. Assignment Understanding

### Prompt

```text
Explain this IT Internship practical assignment in simple terms. I need to understand the story, what a lead is, what advisors do, and what management visibility into a sales pipeline means.
```

### Outcome

The assignment was interpreted as a life insurance CRM workflow:

- Public visitors submit quote requests.
- A quote request becomes a lead.
- Insurance advisors follow up with leads.
- Leads move through sales statuses such as New, Contacted, Follow-up, Interested, Enrolled, or Lost.
- Management needs dashboard visibility into lead counts and pipeline progress.

This helped define the main system flow before implementation.

## 2. Master Prompt / Initial Build Prompt

The master prompt is the main project brief used to start the build. It describes the overall system goals before the smaller follow-up prompts.

### Prompt

```text
Build a secure and responsive insurance CRM for SecureLife Insurance. It should include a public website, plan comparison, quote form, CRM login, lead management, advisor assignment, lead status updates, notes, plan management, user management, and a dashboard.
```

### Outcome

The first version was built using:

- Next.js
- React
- TypeScript
- Tailwind CSS

Initial pages included:

- Public home page
- Insurance plans page
- Quote form
- CRM dashboard
- Leads page
- Plans page
- Users page

## 3. Public User Flow Clarification

### Prompt

```text
When a user enters http://localhost:3000, are they a public user or an admin? The CRM should not show leads before login.
```

### Outcome

The role separation was clarified:

- Public users can access Home, Plans, and Quote pages.
- Admin/advisor users must log in before accessing CRM lead, plan, or user data.

The CRM workspace was then protected so it only renders management data after login.

## 4. Lead Creation Prompt

### Prompt

```text
When a public user fills the quote form and clicks Submit and save as lead, that lead should appear in /admin/leads under the lead sheet. Check and fix this flow.
```

### Outcome

A dedicated lead creation API route was added:

```text
POST /api/leads
```

The quote form was updated to submit lead data to this API. The API saves the new lead into the SQLite-backed CRM state and assigns it to the first available advisor.

## 5. Backend and Persistence Prompt

### Prompt

```text
Does this app have a backend and database? If not, add a real backend/database flow so CRM data persists.
```

### Outcome

The project was upgraded from temporary client-side state to a simple backend/database structure:

- Next.js API routes were used as backend endpoints.
- SQLite was added for local demo persistence.
- `better-sqlite3` was used as the SQLite driver.

Main backend files:

```text
src/app/api/state/route.ts
src/app/api/leads/route.ts
src/app/api/login/route.ts
src/lib/server-db.ts
```

## 6. Login Debugging Prompt

### Prompt

```text
The CRM login button is not showing the logged-in state. I clicked Log in and Enter demo CRM but nothing happened. Check the issue.
```

### Outcome

The login flow was improved by:

- Adding a server-side login route.
- Saving the selected session into the SQLite-backed CRM state.
- Redirecting to the dashboard after successful login.
- Rendering admin pages from server-provided database state.

This made login behavior more reliable during local testing.

## 7. CRM Feature Testing Prompt

### Prompt

```text
Give me a worklist to manually test the project. I will test each item and tell you pass or fail.
```

### Outcome

A manual testing checklist was used:

- Public pages navigation
- Quote form creates lead
- Admin login
- Lead status update
- Advisor assignment
- Lead notes
- Plan create/edit/delete
- User creation
- Advisor login and role limits
- Page refresh stability

The user manually tested these flows and confirmed they passed.

## 8. Documentation Prompt

### Prompt

```text
Create a README for the final deliverables. Include project overview, features, tech stack, setup, demo credentials, testing checklist, and limitations.
```

### Outcome

The README was updated with:

- Project summary
- Feature list
- User flow
- Tech stack
- Project structure
- Demo credentials
- Local setup instructions
- Data storage notes
- Testing checklist
- Known limitations

## 9. Key AI-Assisted Development Decisions

AI assistance was used to help decide and implement:

- The visitor-to-lead-to-advisor CRM flow
- Lead statuses and their meaning
- Admin/advisor role separation
- Public versus protected routes
- SQLite as a lightweight local persistence option
- API route structure for login, lead creation, and state persistence
- Manual testing checklist
- README and project documentation structure

## 10. Validation Performed

The following commands were used during development:

```bash
npm run lint
npm run build
```

Manual browser testing was also completed for:

- Quote submission to CRM lead sheet
- Admin login
- Advisor login
- Lead update workflows
- Plan management
- User management
- Protected CRM access

## 11. Notes on AI Usage

AI was used as a coding and debugging assistant. The implementation was reviewed through manual testing, repeated local runs, and build/lint validation. The final project decisions were made based on the assignment requirements and observed app behavior during testing.
