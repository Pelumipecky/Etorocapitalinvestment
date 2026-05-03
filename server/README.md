# CipherVault - Server (development)

This tiny Express server is intended to run locally during development. It uses a Supabase **service_role** key for server-side operations (do not commit this key).

Quick start (PowerShell):

1) Copy the example env into a real `.env` and edit the values:

```powershell
cd server
copy .env.example .env
# Then open .env and paste your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
```

2) Install and run (development):

```powershell
npm install
npm run dev
```

Endpoints:
- GET /api/health — quick health check
- POST /api/contact — accepts JSON { name, email, subject, message } and stores it in the `contacts` table in Supabase

- POST /api/signup — accepts JSON { email, password, full_name?, username? } and creates a new user via Supabase admin (service_role key). It will attempt to create a `profiles` row as well.
- POST /api/login — accepts JSON { email, password } and returns a Supabase session object on success. For production you'd set an httpOnly cookie instead of returning tokens to the browser.

Notes on sessions & cookies
- The server now sets httpOnly cookies on successful /api/login (`sv_access` and `sv_refresh`). For production set `NODE_ENV=production` so cookies are flagged secure. Consider issuing and rotating refresh tokens server-side.

reCAPTCHA & spam protection
- The contact endpoint enforces a simple hidden honeypot (`hp`) and rate limiting. If you set `RECAPTCHA_SECRET` in `.env`, the server will require a `recaptcha` token in the request body and validate it against Google.

Running tests (unit / integration)
1) From `server/`: install deps then run tests

```powershell
npm install
npm test
```

Test notes: tests cover health-check and basic contact validation + rate limiting. The server also supports running without Supabase credentials for local dev; tests use that fallback mode.

Note: The repository includes `sql/schema.sql` which now contains a `public.contacts` table definition — run that SQL in your Supabase project (or via psql) to create the table used by `/api/contact`.

Security notes:
- Use the Supabase service_role key only on trusted servers (never in the browser). Add this server to your CI/CD deploy secrets.
- Consider adding rate-limiting, spam protection (CAPTCHA), and server-side validation for production.

Quick test (after server is running):

```powershell
# from server/ folder
node test/checkHealth.js
```

