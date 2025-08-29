# personal-task-manager-ravishan

This is a Next.js-based Task Manager Web Application developed with Next.js with Prisma & MongoDB. The project uses TypeScript, Prisma ORM with MongoDB, and is managed with `pnpm`.

## Project Setup

### Prerequisites
- Node.js (v22.18.0 LTS or later)
- `pnpm` (v10.x or higher)
- MongoDB Atlas account (free tier)

### Installation
1. Clone the repository:
git clone https://github.com/your-username/personal-task-manager-ravishan.git
cd personal-task-manager-ravishan

2. Install dependencies using `pnpm`:

pnpm install

3. Set up environment variables (see `.env` structure below).

4. Start the development server:

pnpm dev

5. Open `http://localhost:3000` in your browser.

### Environment Variables (`.env`)
Create a `.env` file in the root directory with the following structure.

DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&#x26;w=majority"</dbname></cluster></password></username>

- Replace `<username>`, `<password>`, `<cluster>`, and `<dbname>` with your MongoDB Atlas credentials and database details.
- Example: `DATABASE_URL="mongodb+srv://myuser:mypassword@cluster0.cdm5zue.mongodb.net/taskmanagerdb?retryWrites=true&w=majority"`
- Note: Use URL-encoding for special characters in the password (e.g., `@` becomes `%40`).