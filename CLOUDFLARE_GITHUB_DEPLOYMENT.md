# Antigravity News (BNA) — GitHub & Cloudflare Deployment Guide

This document provides step-by-step instructions to upload the **ANTIGRAVITY NEWS** full-stack platform to **GitHub** and deploy it to **Cloudflare**.

---

## 1. Quick Git & GitHub Setup

The repository has been initialized with `.gitignore` (safeguarding `node_modules`, `.next`, and local `.env` secrets).

### Step 1: Create a New GitHub Repository
1. Go to [https://github.com/new](https://github.com/new).
2. Repository name: `antigravity-news` (or `bna-news`).
3. Set visibility: **Public** or **Private**.
4. **Do NOT** initialize with README, .gitignore, or license (these are already created).
5. Click **Create repository**.

### Step 2: Push Code to GitHub
Run the following commands in the terminal inside the project directory:

```bash
git init
git add .
git commit -m "Complete BNA News Platform: Full-Stack Multilingual Portal with AdSense, Reporter Publishing & Video Proof"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git
git push -u origin main
```

---

## 2. Deploying to Cloudflare

Next.js 14 App Router can be deployed to Cloudflare using **Cloudflare Pages** or via a **Cloudflare Tunnel**.

### Method A: Cloudflare Pages (Serverless & Edge)

1. **Log in to Cloudflare**:
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com/) and navigate to **Compute (Workers) > Workers & Pages**.
2. **Connect to Git**:
   - Click **Create application** > **Pages** > **Connect to Git**.
   - Select your GitHub account and the `antigravity-news` repository.
3. **Configure Build Settings**:
   - **Framework preset**: `Next.js` (or `Next.js (App Router)`)
   - **Build command**: `npx @cloudflare/next-on-pages@1`
   - **Build output directory**: `.vercel/output/static`
   - **Root directory**: `/`
4. **Configure Compatibility Flags**:
   - Under **Settings > Functions > Compatibility Flags**, add:
     - `nodejs_compat` (Required for Node.js cryptographic and standard libraries).
5. **Set Environment Variables**:
   Under **Settings > Environment variables**, add:
   | Variable | Value | Notes |
   | :--- | :--- | :--- |
   | `DATABASE_URL` | `postgresql://user:pass@host:5432/dbname?sslmode=require` | Production PostgreSQL (e.g. Supabase, Neon, or Cloudflare Hyperdrive) |
   | `JWT_SECRET` | `your-secure-random-64-character-jwt-key` | Session authentication token key |
   | `NEXT_PUBLIC_APP_URL` | `https://your-project.pages.dev` | Your live Cloudflare Pages URL |
   | `NODE_ENV` | `production` | Production environment |
6. **Click Save and Deploy**:
   Cloudflare Pages will build the Next.js bundle and assign a live HTTPS URL (e.g., `https://antigravity-news.pages.dev`).

---

### Method B: Cloudflare Zero Trust / Cloudflare Tunnel (Recommended for Instant Zero-Config Hosting)

If running the application container on a VM, VPS, or self-hosted server with SQLite:
1. Start the production build:
   ```bash
   npm run build
   npm run start
   ```
2. Expose the local port 3000 to your Cloudflare domain:
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```
3. Cloudflare assigns a global SSL edge URL with DDoS protection, edge caching, and web application firewall (WAF).

---

## 3. Database Restoration & Seeding

All current database records (Categories, Articles, Reporters, Users, Ad Settings) are exported into `prisma/backup-data.json`.

To seed or restore your production database on Cloudflare / Supabase / Neon:

```bash
# 1. Push database schema
npm run db:push

# 2. Restore all exported content (users, categories, articles, reporters, ad settings)
npm run db:restore
```

---

## 4. Pre-Configured Administrator Logins

| Role | Email ID | Default Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin@bnanews.in` | `SuperAdmin@123` | Full root access, Google AdSense, User creation |
| **Admin** | `admin@antigravitynews.com` | `Admin@123` | Portal administration, Categories, Comments |
| **Desk Editor** | `editor@antigravitynews.com` | `Editor@123` | Submission review, Approve news to go live |
| **Bureau Reporter** | `reporter@antigravitynews.com` | `Reporter@123` | Ground news filing with location & video proof |

---

## 5. Key Portal URLs

- **News Portal**: `http://localhost:3000/en`
- **Sign In**: `http://localhost:3000/en/auth/signin`
- **Reporter Filing Desk**: `http://localhost:3000/en/submit-news`
- **Reporters Directory**: `http://localhost:3000/en/reporters`
- **Admin Dashboard**: `http://localhost:3000/admin`
- **Submission Review Queue (Approve to Live)**: `http://localhost:3000/admin/submissions`
- **Google AdSense & Monetization**: `http://localhost:3000/admin/ads`
- **User & Role Governance**: `http://localhost:3000/admin/users`
