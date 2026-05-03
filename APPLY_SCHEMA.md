# How to apply `sql/schema.sql` to your Supabase project

Follow one of the methods below to apply the SQL in `sql/schema.sql` (this file contains the `investments` table and stored procedures used by the server).

1) Supabase SQL Editor (recommended)

- Open https://app.supabase.com and select your project
- Go to "SQL" → "New Query"
- Copy the contents of `sql/schema.sql` from the repository and paste into the editor
- Click "Run" (you'll need privileges in your Supabase project - use the project owner or service-role credentials)

2) Using `psql` with a Postgres connection string

- Get your DB connection string from Project → Settings → Database → Connection string (use the admin/service role connection)
- From your shell:

```bash
# Example (replace with your connection string)
PGPASSWORD="<db_password>" psql "postgresql://<db_user>@<db_host>:5432/<db_name>" -f sql/schema.sql
```

3) Supabase CLI (if installed)

- Login and link to your project:

```bash
supabase login
supabase link --project-ref <project-ref>
```

- Apply SQL (CLI may offer `db push` or allow running SQL files depending on version):

```bash
supabase db remote set <connection-string>
# then run the SQL file using psql or the Supabase CLI instructions for your version
```

Notes & next steps
- After applying the schema, set the `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` values in your local `.env` (copy from `.env.example`).
- Restart the server:

```bash
npm run server:start
```

- Verify the server can call RPCs by checking `/api/health` and the server logs. If the server still warns about missing env vars, confirm `.env` is present and `SUPABASE_SERVICE_ROLE_KEY` is set.

If you want, I can guide you through each step and validate the results once you provide your project details or confirm you applied the schema. Do you want me to wait while you paste the applied SQL output or the Supabase confirmation message? 
