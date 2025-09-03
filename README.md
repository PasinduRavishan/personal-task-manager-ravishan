# personal-task-manager-ravishan

This is a Next.js-based Task Manager Web Application developed with Next.js with Prisma & MongoDB. The project uses TypeScript, Prisma ORM with MongoDB, and is managed with `pnpm`.

## Project Setup

### Prerequisites
- Node.js (v22.18.0 LTS or later)
- `pnpm` (v10.x or higher)
- MongoDB Atlas account (free tier)
- Clerk account (free tier, https://clerk.com)

### Installation
1. Clone the repository:
git clone https://github.com/your-username/personal-task-manager-ravishan.git
cd personal-task-manager-ravishan

2. Install dependencies using `pnpm`:

pnpm install

3. Set up Prisma:

pnpm prisma generate
pnpm prisma db push

4. Set up environment variables (see `.env` structure below).

5. Start the development server:

pnpm dev

6. Open `http://localhost:3000` in your browser.

### Environment Variables (`.env`)
Create a `.env` file in the root directory with the following structure.

DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&#x26;w=majority"</dbname></cluster></password></username>

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-publishable-key
CLERK_SECRET_KEY=your-secret-key
CLERK_WEBHOOK_SECRET_KEY=your-webhook-secret-key



- Replace `<username>`, `<password>`, `<cluster>`, and `<dbname>` with your MongoDB Atlas credentials and database details.
- Example: `DATABASE_URL="mongodb+srv://myuser:mypassword@cluster0.cdm5zue.mongodb.net/taskmanagerdb?retryWrites=true&w=majority"`
- Note: Use URL-encoding for special characters in the password (e.g., `@` becomes `%40`).

- Replace `your-publishable-key` and `your-secret-key` with values from your Clerk Dashboard (API Keys section).
- Note: Use URL-encoding for special characters in the password (e.g., `@` becomes `%40`).
- Add CLERK_WEBHOOK_SECRET_KEY from Clerk’s Webhooks section to handle user lifecycle events.

### Usage

- Log in with Clerk authentication to access the task manager dashboard.
- Use the form to create tasks with title, description, due date, priority, and status.
- View and delete tasks from the task list.
- Updates are handled via API routes at /api/tasks/[id].

### Project Structure

- app/: Next.js App Router files (e.g., dashboard/page.tsx, layout.tsx).
- app/api/: API routes for tasks (e.g., route.ts, [id]/route.ts).
- components/ui/: shadcn/ui components (e.g., button.tsx, card.tsx).
- lib/: Utility files (e.g., prisma.ts).
- prisma/: Prisma schema and migration files.

### Dependencies

- Next.js: App Router and Server Actions.
- Prisma: ORM with MongoDB integration.
- Tailwind CSS: Utility-first styling framework.
- shadcn/ui: Customizable UI components.
- Clerk: Authentication and user management.
- pnpm: Package manager.
- zod: Schema validation.
