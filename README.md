<p align="center">
<table align="center">
  <tr>
  	<th colspan="4"><h3><a href="https://www.aiub.edu">American International University-Bangladesh(AIUB)</a></h3></th>
  </tr>
  
  <tr>
  	<th colspan="4"><h3>Advance Programming in Web Technology</h3></th>
  </tr>
  
  <tr>
  	<th colspan="4">Course Teacher: <a href="https://github.com/Abdullah-Shafi-Sagor">S M ABDULLAH SHAFI</a></th>
  </tr>
  
  <tr>
    <th>Name</th>
    <th>ID</th>
    <th>Section</th>
  </tr>
  
  <tr>
    <td><a href="https://github.com/aftabrakinsad">RAKIN SAD AFTAB</a></td>
    <td>20-41991-1</td>
    <td align="center">C</td>
  </tr>
</table>
</p>

# Abroad Study Consulting: Backend API

REST API for a study-abroad consultancy, built with [NestJS](https://nestjs.com), [TypeORM](https://typeorm.io) and PostgreSQL. The frontend lives in [Abroad_Study_Consulting_Next](https://github.com/aftabrakinsad/Abroad_Study_Consulting_Next).

- [How it works](#how-it-works)
- [Run it locally](#run-it-locally) (macOS, Windows, Linux)
- [Deploy it online](#deploy-it-online) (Vercel or Render, with a Neon database)
- [Environment variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## How it works

Students (users) register at `/user/signup`; they're the only accounts that can register. Admins, managers and consultants only sign in (`/admin/signin`, `/manager/signin`, `/consultant/signin`) with accounts created by an admin. The JWT carries the user's role, and each controller only accepts its own role. Only the master admin (`isMaster`) can create, edit or delete admins.

Application workflow: a student submits an application, a manager or admin assigns it to a consultant, and the consultant updates its status and leaves a note the student can see.

On startup the app creates one demo account per role (`DEMO_EMAIL` is the master admin; plus `DEMO_MANAGER_EMAIL`, `DEMO_CONSULTANT_EMAIL`, `DEMO_USER_EMAIL`, all using `DEMO_PASSWORD`) and a sample application. Demo accounts can't be deleted and their passwords can't be changed, so they keep working for visitors.

Tables are created automatically (TypeORM `synchronize: true`), so there are no migrations to run. You only need an empty database.

## Run it locally

You need three things: **Node.js 20 or newer**, **Git**, and a **PostgreSQL database**. The steps below set these up on each operating system, then run the API on <http://localhost:3001>.

### Step 1: Install Node.js and Git

| OS | Command |
|---|---|
| macOS | Install [Homebrew](https://brew.sh), then `brew install node@22 git` |
| Windows | `winget install OpenJS.NodeJS.LTS Git.Git` (or use the installers from [nodejs.org](https://nodejs.org) and [git-scm.com](https://git-scm.com)) |
| Ubuntu / Debian | `sudo apt install git`, then Node 22 via [nvm](https://github.com/nvm-sh/nvm): `nvm install 22` |
| Arch | `sudo pacman -S nodejs npm git` |

Check it worked (open a new terminal first):

```bash
node -v   # v20.x or newer
npm -v
git --version
```

### Step 2: Get a PostgreSQL database

Pick **one** of the options below. Each one ends with an empty database named `APWTDB` and a username and password, which you'll put in `.env` in step 4.

> **Keep the name in capitals.** Postgres is case-sensitive about database names. In `psql`, `CREATE DATABASE APWTDB;` actually creates `apwtdb`, so the app won't find it. Write `CREATE DATABASE "APWTDB";` (with quotes), or use the `createdb APWTDB` command, which keeps the case.

<details>
<summary><b>macOS (Homebrew)</b></summary>

```bash
brew install postgresql@17
brew services start postgresql@17
createdb APWTDB
```

Homebrew creates a database user named after **your macOS username**, with no password and no `postgres` user. In `.env`, set `DB_USERNAME` to the output of `whoami` and leave `DB_PASSWORD` empty.

If `createdb` isn't found, add Postgres to your PATH: `echo 'export PATH="$(brew --prefix postgresql@17)/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc`.

Prefer an app? [Postgres.app](https://postgresapp.com) works too: start it, click **Initialize**, then run `createdb APWTDB`.
</details>

<details>
<summary><b>Windows</b></summary>

1. Download the installer from <https://www.postgresql.org/download/windows/> and run it.
2. When it asks, set a password for the `postgres` user and remember it. Keep port `5432`.
3. Open **SQL Shell (psql)** from the Start menu, press Enter to accept the defaults, type your password, then run:

   ```sql
   CREATE DATABASE "APWTDB";
   ```

In `.env`, use `DB_USERNAME=postgres` and the password you chose.
</details>

<details>
<summary><b>Linux (Ubuntu / Debian)</b></summary>

```bash
sudo apt install postgresql
sudo systemctl enable --now postgresql
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
sudo -u postgres createdb APWTDB
```

In `.env`, use `DB_USERNAME=postgres` and `DB_PASSWORD=postgres`.

On **Arch**, install with `sudo pacman -S postgresql`, initialise once with `sudo -u postgres initdb -D /var/lib/postgres/data`, then follow the same steps from `systemctl` onwards.
</details>

<details>
<summary><b>Any OS with Docker</b></summary>

```bash
docker run --name abroad-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=APWTDB -p 5432:5432 -d postgres:17
```

In `.env`, use `DB_USERNAME=postgres` and `DB_PASSWORD=postgres`. Later, start it again with `docker start abroad-pg`.
</details>

<details>
<summary><b>No install: a free hosted database (Neon)</b></summary>

1. Sign up at <https://neon.tech> and create a project.
2. Copy the connection string from the dashboard (it starts with `postgresql://`).
3. In `.env`, set `DATABASE_URL` to that string and `DB_SSL=true`. The `DB_*` host settings are then ignored.

This is the same database type you'll use when you deploy, so it's a good choice if you don't want Postgres on your computer.
</details>

### Step 3: Download the code and install dependencies

```bash
git clone https://github.com/aftabrakinsad/Abroad_Study_Consulting_Nest.git
cd Abroad_Study_Consulting_Nest
npm install
```

### Step 4: Create the `.env` file

Copy the example file:

```bash
cp .env.example .env        # macOS / Linux
copy .env.example .env      # Windows (Command Prompt or PowerShell)
```

Open `.env` in an editor and fill in:

- `DB_USERNAME` and `DB_PASSWORD`: the database login from step 2.
- `JWT_SECRET`: any long random string. To generate one on any OS:

  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

Leave everything else as it is. `SMTP_HOST` stays empty, so emails are only simulated, which is fine for local use.

### Step 5: Start the API

```bash
npm run start:dev
```

Wait for `Server is running on port 3001`. The server restarts automatically when you edit code. Opening <http://localhost:3001> shows a 404, which is normal: the API has no home page.

Check that the database and demo accounts work:

```bash
curl -X POST http://localhost:3001/admin/signin -H "Content-Type: application/json" -d "{\"email\":\"demo@abroadstudy.com\",\"password\":\"Demo@1234\"}"
```

You should get back `"message":"Login Successful!"` and a token.

### Step 6: Start the frontend

In a **second terminal**, follow the setup in [Abroad_Study_Consulting_Next](https://github.com/aftabrakinsad/Abroad_Study_Consulting_Next#run-it-locally), then open <http://localhost:3000>. Keep this API running while you use the site.

### Other commands

```bash
npm run build        # compile to dist/
npm run start:prod   # run the compiled build
npm run lint         # lint and auto-fix
npm run test         # unit tests
```

## Deploy it online

A deployment has three parts, set up in this order:

1. **Database:** a hosted Postgres (Neon).
2. **This API:** on Vercel (option A) or Render (option B).
3. **The frontend:** on Vercel. See the [frontend README](https://github.com/aftabrakinsad/Abroad_Study_Consulting_Next#deploy-it-on-vercel).

Push your code to GitHub first; both Vercel and Render deploy from your GitHub repositories.

### 1. Create the database

**Through Vercel (simplest if you use option A):** after creating the Vercel project in the next step, open it, go to **Storage → Create Database → Neon**, and connect it to the project. Vercel adds the connection string to the project's environment variables. Make sure there is one named `DATABASE_URL`; if not, add it yourself by copying the value from the Storage tab.

**Directly on Neon:** sign up at <https://neon.tech>, create a project, and copy the **pooled** connection string (the host contains `-pooler`). Pooled connections suit serverless hosting like Vercel, where many short-lived instances connect at once.

You don't need to create any tables; the API does that on its first start.

### 2A. Deploy the API on Vercel

Vercel runs NestJS with no extra config. It finds `src/main.ts` and runs the whole app as one [Vercel Function](https://vercel.com/docs/frameworks/backend/nestjs).

1. Go to <https://vercel.com/new> and import the `Abroad_Study_Consulting_Nest` repository.
2. Leave the framework preset and build settings as Vercel detects them.
3. Under **Environment Variables**, add:

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | your Neon connection string (skip if you connected Neon through Storage) |
   | `DB_SSL` | `true` |
   | `JWT_SECRET` | a long random string (see step 4 above) |
   | `FRONTEND_URL` | your frontend's URL, e.g. `https://abroad-study.vercel.app`. Fill in a placeholder for now and update it after step 3 |
   | `DEMO_EMAIL` | `demo@abroadstudy.com` |
   | `DEMO_MANAGER_EMAIL` | `manager.demo@abroadstudy.com` |
   | `DEMO_CONSULTANT_EMAIL` | `consultant.demo@abroadstudy.com` |
   | `DEMO_USER_EMAIL` | `user.demo@abroadstudy.com` |
   | `DEMO_PASSWORD` | `Demo@1234` |

4. Click **Deploy**. When it finishes, copy the deployment URL (e.g. `https://abroad-study-api.vercel.app`). The frontend needs it.

Notes:

- The first request after a quiet period is slower (a "cold start"): the app connects to the database, checks the tables and the demo accounts before answering.
- Vercel's file system is read-only. This API doesn't store files, so that isn't a problem today, but keep it in mind if you add uploads (use a storage service such as Vercel Blob).
- You can also deploy from the terminal: `npm i -g vercel`, then `vercel` (preview) or `vercel --prod`.

### 2B. Alternative: deploy the API on Render

`render.yaml` already describes the service. On <https://render.com>, choose **New → Blueprint**, select this repository, then fill in `DATABASE_URL` and `FRONTEND_URL` when asked; `JWT_SECRET` is generated for you. On the free plan the service sleeps when idle, so the first request after a pause can take about a minute.

### 3. Connect the frontend

1. Deploy the frontend on Vercel with `NEXT_PUBLIC_API_URL` set to this API's URL (see its [README](https://github.com/aftabrakinsad/Abroad_Study_Consulting_Next#deploy-it-on-vercel)).
2. Come back to this API's settings and set `FRONTEND_URL` to the frontend's exact URL: `https://`, no trailing slash. To allow several (production and preview URLs), separate them with commas.
3. Redeploy the API (**Deployments → ⋯ → Redeploy** on Vercel). Environment variable changes only apply to new deployments.

Sign in on the live site with `demo@abroadstudy.com` / `Demo@1234` to confirm everything is connected.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | for hosted DBs | Full Postgres connection string. When set, the `DB_*` settings below are ignored |
| `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` | for local DBs | Individual connection settings (defaults: `localhost`, `5432`, `postgres`, empty, `APWTDB`) |
| `DB_SSL` | for Neon | `true` for hosted databases that require SSL |
| `PORT` | no | Port to listen on locally (default `3001`). Vercel and Render set this themselves |
| `FRONTEND_URL` | yes, in production | Allowed CORS origin(s), comma-separated. The browser blocks requests from any other site |
| `JWT_SECRET` | yes | Secret used to sign login tokens. Changing it signs everyone out |
| `DEMO_EMAIL`, `DEMO_MANAGER_EMAIL`, `DEMO_CONSULTANT_EMAIL`, `DEMO_USER_EMAIL`, `DEMO_PASSWORD` | no | Demo accounts, one per role (`DEMO_EMAIL` is the master admin) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | no | Real email sending. Without `SMTP_HOST`, emails are simulated instead of sent |

## Troubleshooting

| Problem | Fix |
|---|---|
| `password authentication failed for user ...` | `DB_USERNAME` / `DB_PASSWORD` don't match your database. On macOS with Homebrew, use your macOS username and an empty password |
| `database "APWTDB" does not exist` | Create it as shown in step 2. If you created it in `psql` without quotes, it's called `apwtdb`; either set `DB_DATABASE=apwtdb` or create `"APWTDB"` |
| `connect ECONNREFUSED 127.0.0.1:5432` | Postgres isn't running. Start it (`brew services start postgresql@17`, `sudo systemctl start postgresql`, `docker start abroad-pg`, or the Windows **Services** app) |
| `EADDRINUSE: address already in use :::3001` | Another copy is already running. Stop it, or set a different `PORT` in `.env` (and update the frontend's `NEXT_PUBLIC_API_URL`) |
| Browser console shows a **CORS** error | `FRONTEND_URL` doesn't exactly match the site's address. Check `http` vs `https`, the port, and that there's no trailing slash, then restart or redeploy |
| `self-signed certificate` or SSL errors on Neon | Set `DB_SSL=true` |
| Works locally, fails after deploying | Check the function or service logs (Vercel: **Logs** tab; Render: **Logs**) and confirm every variable in the table above is set |
