# SecureLife CRM

SecureLife CRM is a life insurance lead generation website and lightweight CRM built for the Studyingermany.lk IT Internship practical assignment.

The system connects a public insurance website with an internal CRM workflow. Public users can review plans and submit quote requests, while admins and advisors can log in to manage leads, update the sales pipeline, assign advisors, maintain plans, and manage CRM users.

## Features

### Public Website

- Home page with SecureLife overview
- Insurance plan comparison page
- Quote form for public visitors
- "Talk to Advisor" lead source option
- Quote submissions saved as CRM leads

### CRM Workspace

- Admin/advisor login flow
- Protected CRM pages; public visitors cannot view leads without login
- Dashboard with lead pipeline counts
- Lead sheet with customer details
- Lead status updates
- Advisor assignment
- Lead notes
- Plan create, edit, and delete
- User create/edit support
- Role-aware access:
  - Admin can manage dashboard, leads, plans, and users
  - Advisor can work with dashboard and leads

## User Flow

1. A public visitor opens the website.
2. The visitor reviews available insurance plans.
3. The visitor submits a quote request from the quote page.
4. The system saves the request as a new CRM lead.
5. Admin/advisor logs into the CRM.
6. The lead appears in the lead sheet.
7. Admin/advisor updates status, assigns an advisor, and adds follow-up notes.
8. Management can review the sales pipeline from the dashboard.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- SQLite
- better-sqlite3

## Project Structure

```text
src/app
  page.tsx                 Public home page
  plans/page.tsx           Public plans page
  quote/page.tsx           Public quote form
  admin/*                  CRM pages
  api/leads/route.ts       Lead creation API
  api/login/route.ts       Login API
  api/state/route.ts       CRM state API

src/components
  admin-console.tsx        Main CRM interface
  site-shell.tsx           Shared site layout/navigation

src/lib
  crm-data.ts              Default demo data
  server-db.ts             SQLite read/write layer
  use-crm-store.ts         Client CRM state hook
  types.ts                 Shared TypeScript types
```

## Demo Credentials

Admin:

```text
admin@securelife.lk
admin123
```

Advisor:

```text
advisor1@securelife.lk
advisor123
```

Additional advisor:

```text
advisor2@securelife.lk
advisor123
```

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:3000
```

Useful routes:

```text
Public home:     http://127.0.0.1:3000
Plans:           http://127.0.0.1:3000/plans
Quote form:      http://127.0.0.1:3000/quote
CRM login:       http://127.0.0.1:3000/admin
CRM leads:       http://127.0.0.1:3000/admin/leads
CRM plans:       http://127.0.0.1:3000/admin/plans
CRM users:       http://127.0.0.1:3000/admin/users
```

## Data Storage

The application uses a local SQLite database for demo persistence.

The database is created automatically at:

```text
.data/securelife-crm.sqlite
```

The `.data` folder is ignored by Git because it is local runtime data.

## Testing Checklist

- Public Home page loads
- Plans page shows Basic, Gold, and Premium plans
- Quote form creates a new lead
- New quote lead appears in `/admin/leads`
- Admin login works
- Advisor login works
- CRM data is hidden before login
- Lead status can be updated
- Lead advisor can be changed
- Lead note can be added
- Plan can be created, edited, and deleted
- User can be created and viewed
- Page refresh does not lose saved CRM data

## Validation Commands

```bash
npm run lint
npm run build
```

## Known Limitations

- Authentication is simplified for demo purposes.
- Session state is stored in the local SQLite-backed CRM state, not in production cookies/JWT.
- The SQLite database is local to the running environment.
- Passwords are stored as plain demo values, suitable only for this assignment prototype.
- Email/SMS notifications are not implemented.
- The app is designed as a practical prototype, not a production insurance system.

## Assignment Deliverables

- GitHub repository link
- Live deployment URL
- Prompt documentation
- README documentation
