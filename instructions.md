# instructions.md

## 0. Context for Agents

You are an autonomous coding agent building a **mobile-first, modern, student-centric “College Companion” website**.

High-level goals:

- Modern, sleek UI; minimal, clean, and fast.
- **Mobile-first**: everything must work beautifully on small screens.
- **Student-first UX**: minimising taps/clicks to access daily essentials (timetable, notices, events, resources).
- Dynamic, interactive experience: live updates where helpful, smooth transitions, and clear feedback to the user.

When in doubt, **prioritize student usability over visual experimentation**.

---

## 1. Recommended Tech Stack (Adjustable if Needed)

These are the default assumptions. If the repository already exists, infer from it and adapt.

- **Frontend**
  - Next.js (App Router) + React
  - TypeScript
  - Tailwind CSS for styling
  - shadcn/ui or another headless + Radix UI component set for consistent design
- **Backend**
  - Next.js API routes (or a separate Node.js/Express service if already set)
  - REST/JSON endpoints; keep them simple and well-named
- **Database**
  - PostgreSQL via Prisma ORM (or any existing DB layer if present)
- **Auth**
  - NextAuth (or equivalent) with:
    - Student accounts
    - Admin/staff accounts (role-based access)
- **Other**
  - ESLint + Prettier
  - Git for version control

If any of the above conflict with an existing setup in the repo, **follow the existing conventions** and adjust the instructions accordingly.

---

## 2. MVP Scope (What to Build First)

### MVP 1: Authentication & Onboarding

**Goal:** Let students log in securely and land on a personalized dashboard.

**Must have:**
- Email + password login (or institution SSO if available).
- Simple registration flow (or pre-seeded accounts in dev).
- Role field: `student` | `staff` | `admin`.
- Onboarding step where student sets:
  - Course/branch
  - Year/semester
  - Section
  - Basic preferences (e.g., “show timetable first on dashboard”).

---

### MVP 2: Student Dashboard (Home)

**Goal:** One mobile-first screen that surfaces the most important info for the day.

**Above the fold (first screen without scrolling):**
- Quick greeting: “Good morning, Yuvraj”
- Today’s **timetable** snapshot (current + next class).
- Latest 3–5 important **announcements/notices**.

**Below the fold:**
- Upcoming **events** (next 3).
- Shortcuts:
  - Timetable
  - Notices/Announcements
  - Events
  - Resources (notes, PDFs)
  - Profile/Settings

Interactions:
- Pull-to-refresh on mobile.
- Smooth card tap animations.
- Skeleton loaders while fetching.

---

### MVP 3: Timetable & Schedule

**Goal:** Students quickly see their daily/weekly academic schedule.

Features:
- Daily view (default) — “Today” + ability to switch days.
- Weekly view (simple grid).
- Each class card:
  - Subject name
  - Time range
  - Room
  - Faculty (optional)
- Show “ongoing” class highlighted.
- Timetable data:
  - Stored based on batch/section (e.g. `branch + year + section`).
  - Admin panel to manage timetables (for later; basic seeding is OK in MVP).

---

### MVP 4: Announcements & Notices

**Goal:** Central, student-friendly notice board.

Features:
- List of notices:
  - Title
  - Tag (e.g., `Exam`, `Fee`, `Holiday`, `Placement`)
  - Short description
  - Date posted
- Filters + search by tag, date, and text.
- Mark notice as “important” to show in dashboard.
- “Unread” indicator for new notices (simple boolean per user or “new since last visit”).

Role separation:
- **Students:** read-only.
- **Staff/Admin:** create, edit, archive announcements via a minimal admin UI (can be basic forms in MVP).

---

### MVP 5: Events & Registrations

**Goal:** Let students see what’s happening and register for events easily.

Features:
- Event list:
  - Title, date + time, location
  - Short description
  - Registration deadline
- Event detail page:
  - Full description
  - Capacity (optional)
  - “Register” / “Unregister” button
- Student can see their **Registered Events** list.
- Admin can:
  - Create/edit events
  - View basic list of registered students per event

---

### MVP 6: Resources Hub (Notes / Links / Docs)

**Goal:** One hub for academic resources.

Features:
- Categories (e.g., `Subject`, `Semester`, `Type: pdf/video/link`).
- List view with:
  - Title
  - Subject
  - Type (PDF/Link/Video)
- Click opens:
  - PDF viewer or download
  - External link in new tab
- Basic search by title/subject.

Admin:
- Upload/link resources with metadata (subject, semester, tag).

---

### MVP 7: Profile & Settings

**Goal:** Allow basic personalization, no heavy social features yet.

Features (for students):
- View profile: name, email, branch, year, section.
- Edit preferences:
  - Default landing section on dashboard (e.g., “Timetable” vs “Notices”).
  - Notification preferences (if notifications exist later).
- Dark/light theme toggle.

---

## 3. Non-Functional Requirements

Agents must **respect these at all times**:

- **Mobile-first layout:**
  - Design for a ~360x640 viewport first.
  - Use responsive components (`flex`, `grid`, `gap`, `min-w-0`, etc.).
  - Avoid horizontal scroll; everything should fit width-wise.
- **Performance:**
  - Lazy-load non-critical components.
  - Cache list data where sensible.
- **Accessibility:**
  - Semantic HTML for headings, lists, landmarks.
  - Buttons for actions, links for navigation.
  - Keyboard navigable components.
- **Design language:**
  - Clean, flat, minimal.
  - Use a small, consistent color palette (primary, surface, background, accent, success, warning).
  - Rounded corners, subtle shadows, and good spacing.

---

## 4. Data Models (Initial Draft)

Agents should start with these minimal models (adjust if repo already defines them).

### 4.1 User

```ts
User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'student' | 'staff' | 'admin';
  branch?: string;
  year?: number;
  section?: string;
  createdAt: Date;
  updatedAt: Date;
}
4.2 Announcement
ts
Copy code
Announcement {
  id: string;
  title: string;
  body: string;
  tag: 'Exam' | 'Fee' | 'Holiday' | 'Placement' | 'General';
  isImportant: boolean;
  createdById: string; // User.id
  createdAt: Date;
  updatedAt: Date;
}
4.3 TimetableEntry
ts
Copy code
TimetableEntry {
  id: string;
  branch: string;
  year: number;
  section: string;
  dayOfWeek: number; // 0-6
  startTime: string; // 'HH:MM'
  endTime: string;   // 'HH:MM'
  subject: string;
  room?: string;
  faculty?: string;
  createdAt: Date;
  updatedAt: Date;
}
4.4 Event & Registration
ts
Copy code
Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  registrationDeadline?: Date;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  createdAt: Date;
}
4.5 Resource
ts
Copy code
Resource {
  id: string;
  title: string;
  subject: string;
  semester?: string;
  type: 'pdf' | 'link' | 'video';
  url: string;
  createdById: string;
  createdAt: Date;
}
Agents should ensure referential integrity and migrations accordingly.

5. Project Structure (Suggested)
If no structure exists, agents should create:

text
Copy code
root/
  app/                # Next.js app directory (if using App Router)
    (marketing)/      # Optional public/landing pages
    (app)/            # Auth-protected app / dashboard
    api/              # Route handlers for backend
  components/         # Reusable UI components
  lib/                # Utilities, helpers
  styles/             # Global styles (Tailwind config, etc.)
  prisma/             # Prisma schema and migrations
  public/             # Static assets
  package.json
  README.md
  instructions.md     # This file
6. Implementation Roadmap (Agent Tasks)
Agents should work incrementally and keep PRs/commits focused.

Task 1: Bootstrap Project
Goal: Get a clean, working skeleton app.

Initialize Next.js + TypeScript project.

Install Tailwind CSS and set up a base theme.

Add ESLint + Prettier configs.

Add a root layout with:

<html lang="en">

Mobile viewport meta

Base font (e.g., system or a simple Google font).

Deliverables:

App runs locally with a placeholder home page.

npm run lint and npm run build succeed.

Task 2: Design System & Layout Shell
Goal: Create a consistent layout and basic UI building blocks.

Implement:

AppShell:

Top navbar (app title, menu/profile icon)

Bottom tab bar or floating nav for mobile:

Home, Timetable, Notices, Events, Resources

Card component

Button, Input, Select, Badge, Skeleton

Integrate theming (light/dark) with a simple toggle.

Deliverables:

Reusable components ready for use.

Example page showing layout, cards, and buttons.

Task 3: Auth & Role Management
Goal: Students and admins can log in.

Set up auth:

Create User model & DB migration.

Implement signup (if required) or seed demo users.

Implement login with sessions.

Protect all /app routes behind authentication.

Add simple “role check” helper:

requireRole('admin'), etc.

Deliverables:

Login page (mobile-first).

Redirect authenticated users to dashboard.

Access control enforced on admin pages.

Task 4: Student Dashboard
Goal: Home screen with today-centric info.

Implement /app/dashboard showing:

Greeting with name.

Today’s classes (fetch from Timetable).

Latest important announcements.

Upcoming events.

Use skeleton loaders while data is loading.

Implement pull-to-refresh or a refresh button on mobile.

Deliverables:

Fully functional dashboard page.

Responsive layout tested on mobile viewport.

Task 5: Timetable Views
Goal: Usable timetable for students.

Implement DB models + seeds for TimetableEntry.

Build UI:

Daily view (default).

Weekly view with simple toggle.

Fetch entries based on student’s branch/year/section.

Highlight current/next class based on current time.

Deliverables:

/app/timetable with daily/weekly view.

Works for sample seeded data.

Task 6: Announcements Module
Goal: Centralized notice board.

Implement DB model + CRUD APIs for Announcement.

Student UI:

Paginated list with tags and search.

Detail view (optional for MVP; can be inline expansion).

Admin UI:

Simple form to create/edit/delete announcements.

Dashboard pulls only important + latest announcements.

Deliverables:

/app/notices for students.

/app/admin/notices for admins.

Task 7: Events & Registration
Goal: Events list and student registration.

Implement DB models Event and EventRegistration.

Student UI:

List of events.

Event detail page.

Register/Unregister button (with feedback).

Admin UI:

Create/edit/delete events.

View list of registrations per event.

Deliverables:

/app/events and /app/events/[id] for students.

/app/admin/events for admins.

Task 8: Resources Hub
Goal: Basic academic resources library.

Implement DB model + CRUD APIs for Resource.

Student UI:

Filter by subject/semester/type.

Open PDFs/links in new tab or embedded viewer.

Admin UI:

Upload/link resources with metadata.

Deliverables:

/app/resources for students.

/app/admin/resources for admins.

Task 9: Profile & Settings
Goal: Simple profile management.

Create /app/profile:

Show user info.

Allow editing of branch/year/section (if not bound by institution).

Theme toggle + default tab preference.

Persist user settings.

Deliverables:

Working profile page.

Changes reflected across app (e.g., timetable uses updated branch/year/section).

7. Coding Rules for Agents
Agents must follow these rules while editing this repository:

Do not break the build.

Always ensure npm run build (or equivalent) passes after changes.

Keep changes scoped.

Implement one task or subtask per PR/commit.

Reuse components.

If a generic UI pattern is needed twice, create a reusable component.

Consistent naming.

Use clear names: StudentDashboard, TimetableCard, AnnouncementsList etc.

Avoid unnecessary complexity.

Prefer straightforward solutions over premature optimization.

Document as you go.

Update README.md and inline comments when adding new features or flows.

8. Out-of-Scope for Initial MVP
Agents must not spend time on these until explicitly requested:

Complex chat/messaging systems.

Full offline mode or PWA optimization.

Complex analytics dashboards.

Payment integration.

Highly custom animated graphics beyond simple transitions.

Focus strictly on the MVP features listed above.

9. How to Ask for More Instructions (For Agents)
If a requirement is unclear, agents should:

Inspect the existing codebase and infer conventions.

Use conservative defaults that align with:

Mobile-first

Student-first UX

Simplicity and maintainability

If still ambiguous, prefer a simple, obvious implementation rather than blocking progress.
