# Project Setup Guide

This guide details the steps to set up and run the e-commerce platform locally.

---

## Prerequisites

Before starting, ensure you have the following installed on your local machine:
- **Node.js**: Version `18.x` or higher (recommended: `20.x` LTS)
- **NPM**: Version `9.x` or higher
- **PostgreSQL**: A running local or hosted instance of PostgreSQL database

---

## Installation Steps

### Step 1: Install Dependencies
Run the install command in the root project directory to fetch all packages:
```bash
npm install
```

> [!NOTE]
> If you encounter PowerShell script execution policy errors (e.g. `cannot be loaded because running scripts is disabled`), use:
> ```powershell
> npm.cmd install
> ```

---

### Step 2: Configure Environment Variables
1. Copy the template `.env.example` file and rename it to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open the newly created `.env` file and fill in your actual connection strings and credentials:
   - **DATABASE_URL**: Set this to your PostgreSQL connection string.
   - **NEXTAUTH_URL**: Set this to `http://localhost:3000` for local development.
   - **NEXTAUTH_SECRET**: Generate a random secure key by running:
     ```bash
     npx next auth secret
     ```
     Or manually generate a 32-character string.
   - **Google Client ID & Secret**: (Optional for local testing if credentials login is used) Set up credentials in [Google Cloud Console](https://console.cloud.google.com/) under APIs & Services.
   - **SMTP Credentials**: Set up email transporter settings for sending verification notifications.

---

### Step 3: Set Up Prisma & Database Schema
Sync the database with the Prisma schema models and generate the local Prisma Client:

1. Push the local database schema to your PostgreSQL database:
   ```bash
   npx prisma db push
   ```
2. Generate the Prisma Client wrapper inside the project:
   ```bash
   npx prisma generate
   ```

---

### Step 4: Run the Development Server
Launch the Next.js development server:
```bash
npm run dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

---

## Verification & Commands

### Type Checking & Build
To verify the TypeScript builds correctly:
```bash
npx tsc --noEmit
npm run build
```

### Formatting & Linting
Run ESLint to check for stylistic errors:
```bash
npm run lint
```
